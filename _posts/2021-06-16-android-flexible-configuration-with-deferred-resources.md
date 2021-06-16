---
title: "Android: Flexible configuration with Deferred Resources"
excerpt: Deferred Resources provides flexibility beyond the standard resource-resolution approaches.
tags: Mobile Android Open-source Deferred-Resources
authors:
- Drew Hamilton
header:
  teaser: /assets/images/post/05_color_configuration.png
  teaser_alt: Deferred Resources
category: Mobile
---

Our feature libraries, which include UI, have a number of varying requirements regarding
configuration by our customers. (My colleague Hari wrote about one such library's requirements
[here]({% post_url 2020-08-14-android-configuration-driven-ui-from-epoxy-to-compose %}).) One
category of common configurations is resources—text, colors, images—which may be defined in various
ways, like code, resources, or theme attributes. We created
[Deferred Resources](https://engineering.backbase.com/DeferredResources) to support such
configurations, and with it our customers can consistently declare configuration properties from
any of these common sources:
```kotlin
SomeConfiguration {
    textColor = DeferredColor.Constant(Color.WHITE)
    // or
    textColor = DeferredColor.Resource(R.color.splash_text)
    // or
    textColor = DeferredColor.Attribute(R.attr.colorOnSurface)
}

// Resolved to a @ColorInt in our UI:
@ColorInt val textColor = configuration.textColor.resolve(context)
```

This covers most of our customers' use cases. Deferred Resources has been working well for us for
over a year now.

But beyond these common use cases, Deferred Resources' design provides a lot of flexibility to
provide resources in other ways. Each deferred resource type is an interface with one or more
abstract functions to resolve the underlying resource. Thus, a user of the Deferred Resources
library can define any resource-resolution implementation they'd like. The following are a few
examples of how we are taking advantage of this flexibility.

## Color variants

The Backbase design system has a concept of "color variants," where any theme color has lighter and
darker alternates. These variants are defined by a computed overlay: a "lighter" variant is the
base color with a 30% white overlay, while a "darker" variant is the base color with a 30% black
overlay.

```kotlin
enum class ColorVariant(
    @ColorInt internal val overlay: Int
) {
    LIGHTER(overlay = Color.WHITE.withAlpha(0x4D)),
    DARKER(overlay = Color.BLACK.withAlpha(0x4D)),
}
```

By shipping a `DeferredVariantColor` class with our design system, we can make it very easy for our
feature libraries as well as for our customers to use the same variants:

```kotlin
/**
 * Convert a [DeferredColor] to a [variant] of the same color without resolving it
 * yet.
 */
public fun DeferredColor.variant(variant: ColorVariant): DeferredColor =
  DeferredVariantColor(this, variant)

@Poko internal class DeferredVariantColor(
    private val base: DeferredColor,
    private val variant: ColorVariant
) : DeferredColor {

    /**
     * Using [context], resolve the base color with the variant applied.
     */
    @ColorInt override fun resolve(context: Context): Int =
        ColorUtils.compositeColors(variant.foreground, base.resolve(context))

    /**
     * Using [context], resolve the base color with the variant applied.
     *
     * This implementation does not support states other than the default state.
     */
    override fun resolveToStateList(context: Context): ColorStateList =
        ColorStateList.valueOf(resolve(context))
}
```

With this, anyone using our design system can convert any configured color to a variant of the same
color, even if the base color comes from an outside source and its value has not been resolved yet.

```kotlin
SomeConfiguration {
    buttonColor = DeferredColor.Attribute(R.attr.colorPrimary)
    buttonRippleColor = buttonColor.variant(ColorVariant.DARKER)
}
```

## Supporting Lottie without depending on it

Some of our customers want to use [Lottie](https://airbnb.design/lottie/) to provide fun
micro-animations to our feature libraries' UI. Other customers don't want to use Lottie, or don't
want these animations at all. A custom implementation of the `DeferredDrawable` interface lets us
support Lottie animations indirectly, without actually coupling our libraries
to it or forcing our customers to take it on as a dependency.

As a standalone library, we ship a `DeferredLottieDrawable` class:

```kotlin
interface DeferredLottieDrawable : DeferredDrawable {

    override fun resolve(context: Context): LottieDrawable?

    class Resource(
        @RawRes private val rawRes: Int,
        private val transformations: LottieDrawable.(Context) -> Unit = {},
    ) : DeferredLottieDrawable {
        override fun resolve(context: Context): LottieDrawable? {
            val compositionResult =
                LottieCompositionFactory.fromRawResSync(context, rawRes)
            when (val exception = compositionResult.exception) {
                null -> return compositionResult.value?.asDrawable()?.apply {
                    transformations(context)
                }
                else -> throw exception
            }
        }
    }

    // Other supported types are implemented too: Constant, Asset, and Stream
}

private fun LottieComposition.asDrawable() = LottieDrawable().apply {
    composition = this@asDrawable
}
```

Thanks to the base `Drawable` class and the `Animatable` interface, which are both part of the
standard Android APIs, UI code that expects an animation can display this without knowing whether
Lottie is involved:

```kotlin
val paymentSuccessIndication =
    configuration.paymentSuccessIndication.resolve(context)
imageView.setImageDrawable(paymentSuccessIndication)
if (paymentSuccessIndication is Animatable) {
    paymentSuccessIndication.start()
}
```

Our feature library consumers can provide a `DeferredLottieDrawable` if they are using Lottie, or
any other `DeferredDrawable` if they don't use Lottie:

```kotlin
SomeConfiguration {
    paymentSuccessIndication = DeferredLottieDrawable.Raw(
        R.raw.payment_success_animation
    ) {
        repeatCount = LottieDrawable.INFINITE
    }
    // or
    paymentSuccessIndication = DeferredDrawable.Resource(
        R.drawable.payment_success_icon
    )
    // or
    paymentSuccessIndication = SomeCustomDeferredAnimatedDrawable(customInputs)
}
```

## Remote configuration

We're just starting to explore another possible resource-resolution approach with Deferred
Resources: resolving values from a remote server. Imagine one of our libraries has a configuration
to enable a new feature:

```kotlin
SomeConfiguration {
    coolNewFeatureEnabled = DeferredBoolean.Constant(false)
}
```

A factory that is hooked up to a feature flagging backend could determine in the background whether
any remote configuration has changed, and surface that update when a custom `DeferredBoolean`
implementation is resolved:

```kotlin
interface RemoteConfigApi {

    /**
     * Returns the boolean value defined by [key] according to this
     * [RemoteConfigApi]'s internal state. This may return a default value
     * if the remote API call has not completed.
     */
    fun getBooleanValue(key: String): Boolean
}

class FeatureFlagFactory(
    private val remoteConfigApi: RemoteConfigApi,
) {
    fun createDeferredFeatureFlag(featureName: String): DeferredBoolean =
        object : DeferredBoolean {
            override fun resolve(context: Context): Boolean =
                remoteConfigApi.getBooleanValue(featureName)
        }
}
```

The consuming app can fetch the remote values in the background when the app is launched and use
this factory to create its deferred feature flag, and the feature will be enabled depending on
whatever the configuration backend has returned:

```kotlin
val remoteConfigApi = MyRemoteConfigApi(
    url = "example.com",
    defaultValues = mapOf("coolNewFeature" to false),
).also {
    coroutineScope.launch { it.fetchLatestValues() }
}
val featureFlagFactory = FeatureFlagFactory(remoteConfigApi)

SomeConfiguration {
    coolNewFeatureEnabled =
        featureFlagFactory.createDeferredFeatureFlag("coolNewFeature")
}
```

We're still working on this API's design, but just like our Lottie support, we aim to ship remote
configuration support for our customers that want it, while not forcing it on the customers who
don't.

---

All three of these utilizations of Deferred Resources have one thing in common: they decouple the
specific feature in question from the consumption site—our feature libraries. With this
abstraction, our feature libraries are almost limitlessly flexible while remaining uncoupled from
any specialized resource-resolution approaches.
