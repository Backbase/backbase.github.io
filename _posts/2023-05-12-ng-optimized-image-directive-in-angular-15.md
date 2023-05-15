---
title: "NgOptimizedImage Directive in Angular 15"
excerpt: "Image optimisation techniques and performance improvements with the new NgOptimizedImage directive in Angular 15"
tags: Web NgOptimizedImage Angular
authors:
- Manisha Arya
header:
  teaser: /assets/images/post/ng-optimized-image-directive-in-angular-banner.png
  teaser_alt: NgOptimizedImage Directive in Angular 15
category: Frontend
---

![](/assets/images/post/ng-optimized-image-directive-in-angular-banner.png)

# Introduction

Images constitute a major part of any web application. They heavily impact the page loading times and performance of the web page.

They are one of the main contributors to the [**Core Web Vitals**](https://web.dev/vitals/#core-web-vitals"), identified by Google, to measure website performance.

The metrics that make up the core web vitals are as follows:

{% include
  components/figure.html
  url="/assets/images/post/ng-optimized-image-directive-in-angular-15-0.png"
  description="Core Web Vitals"
%}

To improve the Web Vitals metrics, loading times, and responsiveness of a single-page-application, Angular has introduced the [NgOptimizedImage](https://angular.io/api/common/NgOptimizedImage) directive with Angular v15. This new directive improves image loading performance by providing image optimisation techniques and also enforcing best practices.

# Default `<img>`Tag

Before diving into the key features of the `NgOptimizedImage` directive, let's first examine how the default `<img>` tag functions and the extra optimisation techniques that can be implemented with it.

**No default lazy loading:** the following example includes 6 `img` tags which the browser requests and eagerly loads all of them.

{% include
components/figure.html
url="/assets/images/post/ng-optimized-image-directive-in-angular-15-1.png"
description=" List of images in html"
%}

This can be costly on low-bandwidth devices when there are pages with huge number of images.

{% include
components/figure.html
url="/assets/images/post/ng-optimized-image-directive-in-angular-15-2.png"
description="All images eagerly loaded with img directive"
%}

This problem can be mitigated by using the `loading="lazy"` attribute. It defers the loading of images until they are needed.

Prioritising the loading of a critical image can also be done using the `fetchPriority` attribute. For example, by using `fetchpriority="low"` for images in a carousel.

{% include
components/figure.html
url="/assets/images/post/ng-optimized-image-directive-in-angular-15-3.png"
description="Image optimisation with img tag"
%}

# `NgOptimizedImage` directive

This directive includes built-in image optimisation techniques and improves the website’s performance with minimal configuration.

## Integrating `NgOptimizedImage`

To integrate the `NgOptimizedImage` directive, follow these steps:

1.  Import `NgOptimizedImage` into your standalone component or module.    
2.  Replace the `src` attribute of the image with `ngSrc`.   
3.  Specify the `width` and `height` attributes that must be specified for the `NgOptimizedImage` directive in one of the following ways.
```
//import in module
import { NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
@NgModule({ imports: [CommonModule, NgOptimizedImage], })

// use in component  
import { Component } from '@angular/core'; 
@Component({ 
   selector: 'app-optimised-image-catalog',
   template: `<img ngSrc="blog-food-img" width="500" height="300" alt="Food Blog Image"/> `, 
})
```

Alternatively, you can add it directly in a standalone component.

```import { Component } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
@Component({ 
    selector: 'app-optimised-image-catalog', standalone: true, 
    imports: [ CommonModule, NgOptimizedImage ], 
    template: ` <img ngSrc="blog-food-img" width="500" height="300" alt="Food Blog Image" /> `, })
```

## Key features of `NgOptimizedImage`

The following are the main highlights of this directive:

### Intelligent lazy loading

By default, the directive lazy loads non-critical images and only eagerly loads images marked with the `priority` attribute. This ensures that most images are loaded optimally.

{% include
components/figure.html
url="/assets/images/post/ng-optimized-image-directive-in-angular-15-4.png"
description="Six img tags in HTML"
%}

The following shows that the browser only requests 4 images that are on the view port with the `NgOptimizedImage` directive.

{% include
components/figure.html
url="/assets/images/post/ng-optimized-image-directive-in-angular-15-5.png"
description="Images loaded lazily"
%}

### Serve responsive images

Before implementing responsive images using the directive, you must consider how the `ngSrcset` and `sizes` attributes work.

```
<img ngSrc="business.png" ngSrcset="100w, 200w, 300w" priority sizes="50vw">
```

*   `ngSrcset` specifies three different image sources with widths of 100w, 200w, and 300w. The directive supports both width descriptors for example, `100w`, and [density descriptors](https://web.dev/codelab-density-descriptors/#use-density-descriptors-to-serve-multiple-images), for example,`1x`.
    
*   `sizes` specifies the width of the image container or layout in CSS units, with different sizes for different screen widths.
    

#### srcset

*   The `srcset` attribute can be manually defined by providing your own `ngSrcset` attribute, as given in the example above.
    
*   For responsive images, to automatically generate the `srcset` attribute, you only have to define the sizes attribute. For example, if your image takes 50% of the viewport, set the the size to 50vw and the browser selects the image in the `srcset` that is closest to 50% of the viewport width.
    
*   If you have varying image widths for different sizes of screens you can use media queries. For example in a grid layout, you want image to be 100 percent of screen on devices under 768px wide, else it should be 50%. You can achieve this in the following way:   

```
<img ngSrc="business.png" width="400" height="200" priority sizes="(max-width: 768px) 100vw, 50vw">
```

### Image loader

On a web page, most images are served without regard for the size of the image container. This means that even if you only need a 200 pixel x 100 pixel image, a 2000 pixel x 1000 pixel image is downloaded.

This can be solved by providing an image loader function. This is a function that modifies the provided `src`, and generates multiple URLs to request the image in different sizes. These multiple URLs are used in the automatic [srcset](https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/srcset") generation, so that the images are served with respect to the viewport size.

{% include
components/figure.html
url="/assets/images/post/ng-optimized-image-directive-in-angular-15-6.png"
description="NgOptimizedImage automatically sets srcset attribute based on width attribute"
%}

#### `NgOptimizedImage` loader API

The Angular directive provides a built in loader API for third-party image services such as Imagekit, Cloudfare, Imgix. For more information see [the Angular documentation](https://angular.io/guide/image-directive#configuring-an-image-loader-for-ngoptimizedimage).

In the following example, the directive creates two image URLs in `srcset` for the different widths and density of an image for a an image of size 50\*50.

```
 // in module providers add
import { provideImageKitLoader } from '@angular/common';
providers: provideImageKitLoader('https://ik.imagekit.io/Your-ID') 

// in markup img tag
<img priority ngSrc="custom-img.webp" width="50" height="50" alt="custom image"/> 

//in DOM img tag is changed to this
<img _ngcontent-stl-c204="" priority="" ngsrc="custom-img.webp" width="50" height="50" 
alt="custom image" ng-reflect-priority="" 
ng-reflect-ng-src="custom-img.webp" ng-reflect-width="50" ng-reflect-height="50" 
loading="eager" fetchpriority="high" ng-img="true" 
src="https://ik.imagekit.io/ith29bzjr/tr:q-auto/custom-img.webp" 
srcset="https://ik.imagekit.io/ith29bzjr/tr:q-auto,w-50/custom-img.webp 1x, https://ik.imagekit.io/ith29bzjr/tr:q-auto,w-100/custom-img.webp 2x">
 ```

#### Custom loaders

If your image service is not provided by the `NgOptimizedImage` default loaders, you can create your custom loader as shown in the following example.

> You must include a width check for creating the URL otherwise the provider generates the src with an undefined width.

```
//in module add to providers
import { NgOptimizedImage, IMAGE_LOADER, ImageLoaderConfig } from '@angular/common'; 
[{ provide: IMAGE_LOADER,
 useValue: (config: ImageLoaderConfig) => {
    const url = config.src && config.width ? `./assets/content/${config.src}-img-${config.width}.webp` : `./assets/content/${config.src}-img.webp`;
    return url; } }], 
 
 //in markup 
 <img priority ngSrc="custom-img" width="50" height="50" alt="custom image"/> 
 
 //in DOM the img tag is changed to this
 <img _ngcontent-btb-c158="" ng-reflect-ng-src="business" ng-reflect-width="400" ng-reflect-height="400" 
 alt="business" width="400" height="400" loading="lazy" fetchpriority="auto" 
 ng-img="true" src="./assets/content/business-img.webp" 
 srcset="./assets/content/business-img-400.webp 1x, ./assets/content/business-img-800.webp 2x">
 ```

### preconnect image URL

`NgOptimizedImage` throws a warning in browser console if there is no `preconnect` tag for the third-party image URLs in the head of the page in `index.html`. For more information on preconnect, please refer [here](https://web.dev/preconnect-and-dns-prefetch/).

`<link rel="preconnect" href="https://my.cdn.origin" />`

{% include
components/figure.html
url="/assets/images/post/ng-optimized-image-directive-in-angular-15-7.png"
description="Browser Warning without preconnect image url"
%}

## Performance results

In the following example, an [Angular App](https://github.com/manisha-backbase/image-optimisation-angular) was created with two pages: one using the Angular `NgOptimizedImage` directive, and one with the native image tag. The app was [Deployed](https://image-optimisation-angular.vercel.app/ngoptimized-img-list) and the results compared using [PageSpeed](https://pagespeed.web.dev/).

{% include
components/figure.html
url="/assets/images/post/ng-optimized-image-directive-in-angular-15-8.png"
description="Results with native image tag"
%}

{% include
components/figure.html
url="/assets/images/post/ng-optimized-image-directive-in-angular-15-9.png"
description="Results with NgOptimizedImage directive"
%}
  
The PageSpeed results for the application using `NgOptimizedImage` are a significant improvement with less time for the largest contentful paint. The intelligent lazy loading feature also improves the cumulative layout shift. In conclusion, using the `NgOptimizedImage` directive in your application drastically improves the performance of your application by enforcing the best practices for image optimisation.