---
title: "Angular & Micro Frontends"
excerpt: "Micro Frontends is a modern architectural approach for developing web applications."
tags: Micro Frontends
authors:
  - Harsh Julka
header:
  teaser: /assets/images/post/angular_microfrontends.png
  teaser_alt: Micro Frontends
category: Frontend
---

![](/assets/images/post/angular_microfrontends.png)

# Introduction
Micro Frontends is a modern architectural approach for developing web applications. Instead of creating a large, monolithic web application, it involves building multiple smaller frontend applications. Each of these small applications is responsible for a specific feature, which can be independently deployed and scaled. These Micro Frontends interact with each other to create a seamless user interface. This approach allows for greater flexibility and easier maintenance of web applications.

Micro Frontends Architecture is composed of two or more applications
- Shell/Host Application
- Mutiple Remote applications.

Transform your Angular application into a powerful micro frontend with ease. Simply add these essential dependencies to your project and start unlocking the full potential of micro frontends.
- `@angular-architects/module-federation:` This provides support for webpack module federation plugin.
- `@angular/elements:` Angular elements uses customElementRegistry interface which provides methods for registering custom elements and querying registered elements.

```
Note: Module federation support starts from webpack 5 and Angular 11
```

Without delay let's jump to a practical example.

### Break monolithic app into shell and Remote application.

`Usecase`: Mix two Angular versions.

![](/assets/images/post/monolithic.png)

**Convert our existing project to a shell application.**

```
ng add @angular-architects/module-federation@12.5.3 --project projectName --port shellPort
```

`Use relevant version of @angular-architects/module-federation.` 
<a href="https://www.npmjs.com/package/@angular-architects/module-federation#which-version-to-use" style="color:#1d42b3; text-decoration: none;" target="_blank">check here version compatibility.</a>

```
Note: Above command will generate webpack.config and will replace @angular-devkit/build-angular
with ngx-build-plus in angular.json, to use extra webpack config with angular-cli.
```

![](/assets/images/post/microfrontend.png)

**Create a slot to inject Remote application in the shell application. i.e. <div #vc></div>**

```typescript
import { AfterContentInit, ChangeDetectorRef, Component, ElementRef,
OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { registry } from './registry';

@Component({
  template: '<div #vc></div>',
})
export class WrapperComponent implements AfterContentInit {
  @ViewChild('vc', {read: ElementRef, static: true})
  vc: ElementRef;
  module: any;
  constructor(private route: ActivatedRoute, private cdf: ChangeDetectorRef) { }

  ngAfterContentInit(): void {
    const elementName = this.route.snapshot.data['elementName'];
    const importName = this.route.snapshot.data['importName'];
    if(!this.module) {
      const importFn = registry[importName];
      importFn()
        .then(m => {
          console.debug(`element ${elementName} loaded!`)
          this.module = m;
        })
        .catch(err => console.error(`error loading ${elementName}:`, err));  
    }
    const element = document.createElement(elementName);
    this.vc.nativeElement.appendChild(element);
  }
}
```

**Create a Registry for loading remote app inside shell application**


```typescript
import { loadRemoteModule } from '@angular-architects/module-federation';

export const registry = {
    remoteApp: () => loadRemoteModule({
        remoteEntry: 'http://localhost:4201/remoteEntry.js',
        remoteName: 'remote-app',
        exposedModule: './web-components'
    })
};
```
<br/>

### Remote application 

**Create Remote application**

```typescript
ng new remote-app 
ng add @angular-architects/module-federation@13.0.1 --project remote-app  --port 4201 --type remote
```

`Use relevant version of @angular-architects/module-federation` <a href="https://www.npmjs.com/package/@angular-architects/module-federation#which-version-to-use" style="color:#1d42b3; text-decoration: none;" target="_blank">check here version compatibility.</a>

**Define customElement**

```typescript
export class AppModule {
  constructor(private injector: Injector) {
  }

  ngDoBootstrap() {
    const ce = createCustomElement(AppComponent, { injector: this.injector });
    customElements.define('remote-element', ce);
  }
}
```

**Connect navigation b/w shell and remote application**

```
Note: We are using wrapperComponent that we have created in above steps.
We are also passing extra data object which will be used to loadModule in through module federation i.e registry we created in above steps.
```

```typescript
// Shell application router
 {
    path: 'remote-app/{routeName}',
    component: WrapperComponent,
    data: { importName: 'remoteApp', elementName: 'remote-element' },
 },
```

```typescript
// Remote application Router (Normal routing)
const routes: Routes = [
    {
      path: 'remote-app',
      children: [
        {
          path: 'transactions',
          loadChildren: () =>
            import('./features/transactions.module').then((m) => m.TransactionsModule)
        },
        {
          path: 'cards',
          loadChildren: () =>
            import('./features/card-management.module').then(
              (m) => m.CardsManagementModule
          )
        }
      ]
    }
]
```

**Integrate Lerna**

Currently, we have two separate workspaces and require a monorepo tool to efficiently run and cache them. To accomplish this, we have decided to utilize Lerna.

It solves two of the biggest problems of JavaScript/TypeScript monorepos:
- Lerna runs a command against any number of projects, and it does it in the most efficient way, in the right order, and with the possibility to distribute that on multiple machines.

- Lerna manages your publishing process, from version management to publishing to NPM, and it provides a variety of options to make sure any workflow can be accommodated.

```JSON
// Run this command at root of project
npx lerna init

// Sample lerna.json
{
  "$schema": "node_modules/lerna/schemas/lerna-schema.json",
  "useWorkspaces": false,
  "version": "0.0.0",
  "packages": [
    "retail-remote-app",
    "inm-retail-project"
  ]
}

// root package.json
{
  "name": "root",
  "private": true,
  "devDependencies": {
    "lerna": "^6.5.1"
  },
  "scripts": {
    "bootstrap": "lerna bootstrap",
    "start": "lerna run start --stream"
  }
}

```

**Benefits & Drawbacks of using Micro Frontends:**

![](/assets/images/post/mf-worth-it.png)

# Conclusion
Micro Frontends offer tremendous flexibility and scalability to developers and enterprise applications. With this architecture, individual teams can work and deploy features independently without affecting other features. However, the initial setup of Micro Frontends requires extra time to set up on developer machines as well as on pipelines. Despite this, the benefits of Micro Frontends architecture outweigh the drawbacks by a significant margin.