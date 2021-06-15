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

At Backbase R&D, we ship a number of mobile banking features as independent libraries, where each
one encompasses a specific user journey. For example, our Authentication Journey lets the user log
in with username, passcode, or biometrics. Our Accounts & Transactions Journey summarizes the user's
accounts and lets them view the transaction history for each account. The Payments Journey lets the
user select a recipient and then send a payment to that recipient.

Our customers use these Journey libraries to build their banking apps. While every banking app has
similar features, each bank has its own branding – colors, design conventions, and general character
of their app. Since each Journey ships its own UI, we need to have a way to support different design
decisions by different customers.

The primary way we do this is by shipping and respecting a Backbase XML theme, based on Google's
material theme, which includes various different attributes used to style text, colors, and more.
Editing the app theme allows each independent Journey to maintain a consistent look and feel. But
what if a customer wants to change a design aspect of a single Journey? Maybe one Journey supports
a custom background in favor of the default `?colorBackground` attribute. And to support a custom
background, the Journey also must support custom text and button colors, so the UI can maintain
appropriate contrast.

So how can we support such individualized configurations? In addition to colors and images, we want
all text to be configurable too. All three of these are often defined as resources, and resources
require a `Context` to resolve. But `Context`s can change, while our consumer want to define their
configurations in one place. At the same time, some consumers may want to provide some of these
items not from resources, but from, say, a backend.

To address this need, we created [Deferred
Resources](https://engineering.backbase.com/DeferredResources) as the basis for all of our
configurations. Deferred Resources is designed to decouple the declaration of resource types from
their `Context`-based resolution. This design also opens up a lot of flexibility for declaring such
values.

Let's take the color of an item of text that is displayed over a configured background as an
example. A developer may want to define this in one of several ways: If the background is dark,
`Color.WHITE` will suffice. If the background may be dark or light, then maybe a resource color that
changes in dark mode is needed, like `R.color.splash_text`. Or maybe a theme-based color is needed,
like `R.attr.colorOnSurface`. Deferred Resources' `DeferredColor` type supports all three of these,
and is resolved the same within our UI code, regardless of which type was used:
```kotlin
SomeConfiguration {
    textColor = DeferredColor.Constant(Color.WHITE)
    textColor = DeferredColor.Resource(R.color.splash_text)
    textColor = DeferredColor.Attribute(R.attr.colorOnSurface)
}

// Resolved the to a @ColorInt in our UI:
@ColorInt val textColor = configuration.textColor.resolve(context)
```

Furthermore, a consumer of this configuration can provide a custom implementation of `DeferredColor`
that resolves any way they please. Perhaps they saved the color as a user setting, and want to
retrieve it from a `SharedPreferences` instance:
```kotlin
data class PreferredColor(
    private val preferencesName: String,
    private val colorPreferenceKey: String,
    @ColorInt private val defaultColor: Int,
) : DeferredColor {

    @ColorInt
    override fun resolve(context: Context): Int {
        val preferences = context.getSharedPreferences(preferencesName, Context.MODE_PRIVATE)
        return preferences.getInt(colorPreferenceKey, defaultColor)
    }

    override fun resolveToStateList(context: Context): ColorStateList =
        ColorStateList.valueOf(resolve(context))
}
```

Or perhaps they will pull the color from some remote configuration API:
```kotlin
class RemoteColor(
    remoteConfigApi: RemoteConfigApi,
    colorName: String,
    defaultColorStateList: ColorStateList,
    coroutineScope: CoroutineScope,
    backgroundDispatcher: CoroutineDispatcher = Dispatchers.IO,
) : DeferredColor {

    private var resolvedColor: ColorStateList = defaultColorStateList

    init {
        coroutineScope.launch(backgroundDispatcher) {
            resolvedColor = remoteConfigApi.fetchColor(colorName)
        }
    }

    @ColorInt
    override fun resolve(context: Context): Int = resolvedColor.defaultColor

    override fun resolveToStateList(context: Context): ColorStateList = resolvedColor
}
```

By accepting any instance of the `DeferredColor` interface, 
