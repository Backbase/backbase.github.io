---
title: "Installing HMS Core in Android Studio Emulator"
excerpt: "If you want to test your HMS implementation and you do not have a Huawei device, it is easy to mock it and test these services in the Android Studio emulator."
tags: Mobile Android Huawei HMS
authors:
- Edgar Barragan
header:
  teaser: /assets/images/post/hms-core/hms_core_banner.png
  teaser_alt: Huawei logo
category: Android
---

![](/assets/images/post/hms-core/hms_core_banner.png)

# Introduction

This is a quick guide with few and simple instructions on installing HMS Core in Android Studio Emulator. If you want to test your HMS implementation and you do not have a Huawei device, this is your best option.

# Steps

**1.** Create a new device with only Google APIs, no Play Store. For this example, a Pixel 4a with API 31 is being used.

Choose a device without Play Store.

![](/assets/images/post/hms-core/hms_core_step_1.png)

Choose a version of Android with Google APIs.

![](/assets/images/post/hms-core/hms_core_step_1.1.png)

**2.** Install the Huawei AppGallery APK

You can either Google or install it from the [Huawei Consumer website](http://consumer.huawei.com/en/mobileservices/appgallery/).

Download the AppGallery APK.

{% include components/figure.html url="/assets/images/post/hms-core/hms_core_step_2.png" max-height="600px" %}

Allow installing unknown apps in Chrome browser and install the app.

{% include components/figure.html url="/assets/images/post/hms-core/hms_core_step_2.1.png" max-height="600px" %}

**3.** Install HMS Core.

Open the AppGallery, you will be prompted to install HMS Core. Proceed with the installation.

{% include components/figure.html url="/assets/images/post/hms-core/hms_core_step_3.png" max-height="600px" %}

**4.** Allow the installation of unknown apps.

Once the HMS Core has been downloaded, you need to allow installing unknown apps from AppGallery to install it.

{% include components/figure.html url="/assets/images/post/hms-core/hms_core_step_4.png" max-height="600px" %}

**5.** Verify it all went well.

Press “Done”, then press the back button, you will see the AppGallery login screen.

{% include components/figure.html url="/assets/images/post/hms-core/hms_core_step_5.png" max-height="600px" %}

Verify that the HMS Core app is installed.

{% include components/figure.html url="/assets/images/post/hms-core/hms_core_step_6.png" max-height="600px" %}

# Conclusion

Installing HMS Core in Android Studio Emulator is straight forward and now you can use its rich arrat of open device and cloud capabilities. 
