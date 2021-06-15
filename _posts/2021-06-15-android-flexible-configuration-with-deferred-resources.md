---
title: "Android: Flexible configuration with Deferred Resources"
excerpt: "TODO"
tags: Mobile Android Open-source Deferred-Resources
authors:
- Drew Hamilton
header:
  teaser: TODO
  teaser_alt: Deferred Resources
category: Mobile
---

Our feature libraries, which include UI, have a number of varying requirements regarding
configuration by our customers. (My colleague Hari talked about one such library's requirements
[here]({% post_url 2020-08-14-android-configuration-driven-ui-from-epoxy-to-compose %}).) One
category of common configurations is resources—text, colors, images—that may come from various
places, like code, resources, or theme attributes. We created
[Deferred Resources](https://engineering.backbase.com/DeferredResources) to address this need, and
with it our customers can easily declare such configurations from any of these common sources:
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

This, along with all the other deferred resource types like `DeferredText` and `DeferredDrawable`,
covers most of our customers' use cases. Deferred Resources has been working well for us for over a
year now.

// TODO: Weird wording
But outside of these standard use cases, Deferred Resources' design provides a lot of flexibility to
provide resources in other ways. Each deferred resource type is an interface with one or more
abstract functions to resolve the underlying resource. A user of the library can define any
implementation of these interfaces they'd like. asd;lfjasdlkfj

## Color variants

The Backbase design system has a concept of "color variants", where any theme color has lighter and
darker alternates. These variants are defined by a computed overlay: For example, a "lighter"
variant is the color with a 30% white overlay, while a "darker" variant is the color with a 30%
black overlay.

```kotlin
enum class ColorVariant(
    @ColorInt internal val foreground: Int
) {
    LIGHTER(Color.WHITE.withAlpha(0x4D)),
    DARKER(Color.BLACK.withAlpha(0x4D)),
    // More variants defined here
}
```

By shipping a `DeferredVariantColor` class with our design system, we can make it very easy for our
libraries as well as for our customers to use the same variants:

```kotlin
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

/**
 * Convert [DeferredColor] to a [variant] of the same color without resolving it yet.
 */
public fun DeferredColor.variant(variant: ColorVariant): DeferredColor =
    DeferredVariantColor(this, variant)
```

With this, anyone using our design system can easily convert any configured color to a variant of
the same color without necessarily knowing the original color.

```kotlin
button.backgroundColor = configuration.buttonColor.resolve(context)
button.rippleColor = configuration.buttonColor.variant(ColorVariant.DARKER).resolve(context)
```

## Supporting Lottie without depending on it

Some of our customers want to use [Lottie](https://airbnb.design/lottie/) to provide fun
microanimations to our UI. Others don't want to use Lottie, or don't want animations at all. The
`DeferredDrawable` interface lets us support Lottie animations indirectly, without actually coupling
our libraries to it or forcing all of our customers to take it on as a dependency.

As a standalone library, we can ship a `DeferredLottieDrawable` class:

```kotlin
interface DeferredLottieDrawable : DeferredDrawable {

    override fun resolve(context: Context): LottieDrawable?

    class Resource(
        @RawRes private val rawRes: Int,
        private val transformations: LottieDrawable.(Context) -> Unit = {},
    ) : DeferredLottieDrawable {
        override fun resolve(context: Context): LottieDrawable? {
            val compositionResult = LottieCompositionFactory.fromRawResSync(context, rawRes)
            when (val exception = compositionResult.exception) {
                null -> return compositionResult.value?.asDrawable()?.apply {
                    transformations(context)
                }
                else -> throw exception
            }
        }
    }

    // And other supported types: Constant, Asset, and Stream
}

private fun LottieComposition.asDrawable(): LottieDrawable = LottieDrawable().apply {
    composition = this@asDrawable
}
```

UI code that expects an animation can now display this without ever knowing whether Lottie is
involved:
```kotlin
val paymentSuccessIndication = configuration.paymentSuccessIndication.resolve(context)
imageView.setImageDrawable(paymentSuccessIndication)
if (paymentSuccessIndication is Animatable) {
    paymentSuccessIndication.start()
}
```

Meanwhile, our customers can provide a LottieDrawable if they want, or any other `DeferredDrawable`
if they don't want Lottie:
```kotlin
SomeConfiguration {
    paymentSuccessIndication = DeferredLottieDrawable.Raw(R.raw.payment_success_animation) {
        repeatCount = LottieDrawable.INFINITE
    }
    // or
    paymentSuccessIndication = DeferredDrawable.Resource(R.drawable.payment_success_icon)
    // or
    paymentSuccessIndication = SomeCustomTypeOfDeferredAnimatedDrawable(customInputs)
}
```

## Remote configuration

We're just starting to explore another possible application of deferred resources: Resolving
resources from a remote server. Imagine one of our libraries has a configuration for whether a new
feature is enabled or not:
```kotlin
SomeConfiguration {
    coolNewFeatureEnabled = DeferredBoolean.Constant(false)
}
```

A factory that is hooked up to a feature flagging backend could determine in the background whether
any remote configuration has changed, and surface that update in a custom `DeferredBoolean`
implementation:
```kotlin
interface RemoteConfigApi {
    /**
     * Fetches all remotely configured values from the remote configuration server and updates
     * internal state accordingly.
     */
    suspend fun fetchLatestValues()

    /**
     * Returns the boolean value defined by [key] according to this [RemoteConfigApi]'s internal
     * state. Returns a default value if [fetchLatestValues] has never been called.
     */
    fun getBooleanValue(key: String): Boolean
}

class FeatureFlagFactory(
    private val remoteConfigApi: RemoteConfigApi,
) {
    fun createDeferredFeatureFlag(featureName: String): DeferredBoolean = object : DeferredBoolean {
        override fun resolve(context: Context): Boolean =
            remoteConfigApi.getBooleanValue(featureName)
    }
}
```

The consuming app can fetch the remote values in the background when the app is launched, use this
factory to create their DeferredFeatureFlag, and the feature will be enabled depending on whatever
the configuration backend has returned:

```kotlin
val remoteConfigApi: RemoteConfigApi = MyRemoteConfigApi(
    url = "example.com",
    defaultValues = mapOf("coolNewFeature" to false),
).also {
    coroutineScope.launch { it.fetchLatestValues }
}
val featureFlagFactory = FeatureFlagFactory(remoteConfigApi)

SomeConfiguration {
    coolNewFeatureEnabled = featureFlagFactory.createDeferredFeatureFlag("coolNewFeature")
}
```

We're still working on this API's design, but just like our Lottie support, we aim to ship remote
configuration support for our customers that want it, while not forcing it on the customers who
don't.

---

FIXME: Weird wording.
All three of these demonstrations of the flexibility of Deferred Resources have one thing in common:
They decouple the specific feature in question from the consumption site—our feature libraries.
This way, our feature libraries can remain lightweight while supporting countless configurable
concepts.
