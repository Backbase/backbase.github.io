---
title: "Angular standalone components"
excerpt: "A simplified way to build Angular applications"
tags: Web Angular standalone
authors:
- Ankit Pant
header:
  teaser: /assets/images/post/angular-standalone-components.png
  teaser_alt: Angular standalone components
category: Frontend
---

![](/assets/images/post/angular-standalone-components.png)

# Introduction

Angular [standalone components](https://angular.io/guide/standalone-components "https://angular.io/guide/standalone-components") are independent and self-contained building blocks in an Angular application. This means that every standalone component can now independently import the dependencies required for its functionality.  
While standalone components are not obligatory and do not have strict usage rules, Angular architects highly recommend their adoption, particularly for newly created components.

Once a component, directive, or a pipe is marked as `standalone: true`, they don't need to be declared or imported in `NgModule`, and you can import all the dependencies directly in the component itself, thus eliminating the use of `NgModule` entirely.

 ```typescript
 @Component({
   selector: '...',
   templateUrl: '...',
   styleUrls: ['...'],
   standalone: true,
   imports: [
     NgIf,
     NgFor,
     AsyncPipe,
     ...
   ],
 })
 export class FooBarComponent {
```

# Migrate to Standalone via schematics

Angular provides a [schematic to migrate](https://angular.io/guide/standalone-migration#migrate-an-existing-angular-project-to-standalone "https://angular.io/guide/standalone-migration#migrate-an-existing-angular-project-to-standalone") an existing Angular applications which is using angular `v15` or later, to use the standalone features.

 ```
 ng generate @angular/core:standalone
```

**Step 1:** **Run schematic command to convert all components, directives and pipes to standalone:** schematics goes through all files and migrates them to use standalone features.

**Step 2: Run schematic command to remove unnecessary NgModule classes:** schematics looks for empty `NgModule` after the migration and removes them from the application.

**Step 3: Run schematic command to bootstrap the project using standalone APIs:** schematics changes how the application is bootstrapped in the `main.ts` file.

_**Note:**_ Angular aims in preventing any breaking changes to the application with the standalone feature and hence will still keep most of the `NgModule` or other files, so you might have to remove and migrated some of the files manually.

# Generate a standalone component via Angular cli

 ```
 ng generate component --standalone account-statements
```

A component generated with `--standalone` flag is not added to `NgModule` and will contain default imports like `CommonModule` to get started with the component right away.

# Adopt standalone components incrementally

Standalone components can be seamlessly combined with existing modules, providing flexibility in their implementation and hence you adopt this awesome feature incrementally. A `standalone` component, pipe or directive could also be imported into an existing `NgModule` configuration and thus avoiding any breaking changes to your application and adopting it incrementally for a complex application.

 ```typescript
 @NgModule({
   declarations: [...],
   exports: [...]
   imports: [
     AccountDetailsComponent, // This is a standalone component
     CommonModule,
     RouterModule.forChild(routes),
     .....
   ],
 })
```

# Differences between using NgModules and Standalone feature

## Bootstrapping an Application

Once the `AppComponent` is standalone you can get rid of the `AppModules` completely and use  
[bootstrapApplication](https://angular.io/api/platform-browser/bootstrapApplication "https://angular.io/api/platform-browser/bootstrapApplication") API to bootstrap the application in `src/main.ts` file and importing the dependencies directly in the `AppComponent`, you can find more about this [here](https://angular.io/guide/standalone-components#bootstrapping-an-application-using-a-standalone-component "https://angular.io/guide/standalone-components#bootstrapping-an-application-using-a-standalone-component").

{% include
components/figure.html
url="/assets/images/post/angular-standalone-components-1.png"
description="Bootstrapping an Application"
%}

## Changes in the Routing configuration

With standalone feature in place, `NgModule` is no long required for many lazy loading scenarios, you can simply lazy load a standalone component by exporting the routes and using `loadComponent` instead of `loadChildren` and then provide them in the `src/main.ts` files using `provideRouter()` from `@angular/router` as shown below.

{% include
components/figure.html
url="/assets/images/post/angular-standalone-components-2.png"
description="Changes in the Routing configuration"
%}

## Migrate a component to a Standalone

Converting a component to standalone is quite simple and can be done either

* Using the schematics

* Could be done manually

The steps below shows how to migration an existing component to standalone component

* Mark the component standalone by adding `standalone: true` as the meta data in the `@Component` directive.

     ```typescript
     @Component({
       ...
     +  standalone: true,
    ```

* Import all the `dependencies` in the standalone component from `ngModules`

     ```typescript
     @Component({
       ...
       standalone: true,
     +  imports: [
     +   TransactionsAccountSelectComponent, //another standalone component
     +   HeaderModule, // non-standalone component can be imported like this
     +   NgIf,
     +   NgFor,
     +   AsyncPipe,
     +   JsonPipe,
     +  ]
     })
    ```

* Create and export `routing.ts` if the component has [child routes](https://angular.io/guide/standalone-components#providing-services-to-a-subset-of-routes "https://angular.io/guide/standalone-components#providing-services-to-a-subset-of-routes")

* Remove the `NgModule` & the routing configurations

{% include
components/figure.html
url="/assets/images/post/angular-standalone-components-3.png"
description="Migrate a component to a Standalone"
%}

## Specs for Standalone component

The TestBed configuration now doesn't needs to import all the dependencies used by the component  
you are testing and hence reduces the boilerplate code in the spec file.

{% include
components/figure.html
url="/assets/images/post/angular-standalone-components-4.png"
description="Specs for Standalone component"
%}

_**NOTE:**_ After the migration the specs might be broken and might need manual fixes

# Improvements on performance using standalone feature

Here are a few ways in which Angular standalone components can contribute to performance improvements:

* **Reduced bundle size:** You can reduce the overall bundle size of your app by using Angular's standalone feature and eliminating NgModules and the boilerplate code that comes with it.

* **Isolation and lazy loading:** You can enhance the performance by encapsulating functionality within standalone components which helps to load all the resource only when it is lazy loaded.

* **Reusability:** Angular standalone components are self-contained, independent, and can be re-utilized across the application.

# Bundle size

The actual impact on bundle size will depend on the complexity and size of your Angular component as well as the specific dependencies it requires. The difference in bundle size was not that huge (about 8.5 kb) for a small application which is also mentioned in the table below, but it might make a big difference with the large applications. While using Angular standalone components can reduce bundle size, other factors such as code optimization, tree shaking, and lazy loading can also play a role in optimizing bundle size.

| Application type            | Bundle size   |
| -------------------------   | ------------- |
| Non Standalone application  | 7648528 bytes |
| Standalone application      | 7640882 bytes |
