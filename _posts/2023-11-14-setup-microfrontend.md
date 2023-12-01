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
Micro Frontends is a modern architectural approach for developing web applications. Instead of creating a large, monolithic web application, it involves building multiple smaller frontend applications. Each of these small application is responsible for a specific feature, which can be independently deployed and scaled. These micro frontends interact with each other to create a seamless user interface. This approach allows for greater flexibility and easier maintenance of web applications.

Micro Frontends Architecture is composed of two or more applications:
- Shell/Host Application
- Mutiple Remote applications

You can transform your Angular application into a powerful micro frontend with ease. Simply add these essential dependencies to your project and start unlocking the full potential of micro frontends.
- `@angular-architects/module-federation:` This provides support for webpack module federation plugin.
- `@angular/elements:` Angular elements use `CustomElementRegistry` interface which provide methods for registering custom elements and querying registered elements.


**Note**: Module federation support starts from Webpack 5 and Angular 11.


Without delay let's jump into a practical example.

### Break monolithic app into Shell and Remote application

![](/assets/images/post/monolithic.png)

**Convert your existing project to a shell application**

Use below command to add module federation dependency in shell application:

```console
ng add @angular-architects/module-federation@<version> --project projectName --port shellPort --type host
```

Use relevant version of @angular-architects/module-federation.
<a href="https://www.npmjs.com/package/@angular-architects/module-federation#which-version-to-use" target="_blank">Check version compatibility here.</a>


**Note:** Above command will generate `webpack.config` and will replace `@angular-devkit/build-angular`
with `ngx-build-plus` in `angular.json`, to use additional webpack config with angular-cli.

![](/assets/images/post/microfrontend.png)

**Create a slot to inject Remote application in the shell application, i.e.** `<div #vc></div>`

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
  constructor(private renderer2: Renderer2, private route: ActivatedRoute) { }

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
    const element = this.renderer2.createElement(elementName) as HTMLElement;
    this.renderer.appendChild(this.vc.nativeElement, element);
  }
}
```

**Create a Registry for loading remote app inside shell application**

By using `loadRemoteModule` from module federation, load the remote application in `WrapperComponent`
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

**Create Remote application**

Bootstrap a new Angular project and run the following commands to add module federation dependencies. Additionally, we need to add the Angular Elements package to the project.
```console
ng new remote-app 
ng add @angular-architects/module-federation@<version> --project remote-app  --port 4201 --type remote
npm install @angular/elements@<version>
```

Use relevant version of @angular-architects/module-federation. <a href="https://www.npmjs.com/package/@angular-architects/module-federation#which-version-to-use" target="_blank">Check version compatibility here.</a>

**Define customElement**

Angular elements are Angular components packaged as custom elements (also called Web Components), a web standard for defining new HTML elements in a framework-agnostic way.

Angular provides the `createCustomElement()` function for converting an Angular component, together with its dependencies, to a custom element.

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

To load the remote application, you can use `WrapperComponent` that was created in above steps.

**Note:** Also, pass an extra data object which will be used to load the relevant module.

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

**Handle Remote App Navigation**

```typescript
export class AppComponent implements OnInit {
  constructor(
    private router: Router,
    @Inject(APP_BASE_HREF) public baseHref:string
  ) { }


  ngOnInit(): void {
    const path = environment.production ? location.pathname.split(this.baseHref)[1] : location.pathname.substr(1);
    this.router.navigateByUrl(path);
  }
}
```
**Note**: APP_BASE_HREF is base href of shell application.

**Integrate Lerna**

Currently, we have two separate workspaces and require a monorepo tool to efficiently run and cache them. To accomplish this, we have decided to utilize Lerna.

It solves two of the biggest problems of JavaScript/TypeScript monorepos:
- Lerna executes a command against any number of projects, and it does it in the most efficient way, in the right order, and with the possibility to distribute that on multiple machines.

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

**Challenges and Solutions in implementing Micro Frontends**

**Theming**

**Challenge**: How to ensure consistent styling across shell and remote applications?

Let's see four different ways to share theming between shell and remote applications.
- Shared global theme for shell and remote applications.
- Theme in only shell application.
- Standalone theme in both shell and remote applications.
- Standalone theme in shell application and lazy load theme of remote application.

![](/assets/images/post/mf-theming.png)

**Solution**: Based on above illustration, the most efficient approach for maintaining consistent CSS is to implement global shared theme.

A shared global theme or at shell only is the only possible way to do styling in micro frontends. Also, we only considered <a href="https://www.npmjs.com/package/@angular-architects/module-federation#which-version-to-use" target="_blank">ITCSS architecture</a> for this POC and haven't explored component-level styling.


**Duplicate Source Code**

**Challenge:** How to prevent code duplicacy between shell and remote applications?

**Example:** Duplicate Interceptors between shell and remote application.

An interceptor is a middleware component that intercepts incoming and outgoing HTTP requests and responses. It provides a way to modify or enhance these requests and responses before they are processed by the application or sent to the server. It can be used for a variety of purposes, such as logging, caching, authentication, and error handling.

**Note:** We can’t share instance of a class between applications. Thus, we can’t use same interceptor at both shell and remote level. 


**Solution:**

- Create a shared library 
- Using shared key of module federation plugin, we can define the library which should be shared between
all the federated modules.

```typescript
const { ModuleFederationPlugin } = require('webpack').container;
module.exports = {
  plugins: [
    new ModuleFederationPlugin({
      // adds date-fns as shared module
      shared: share({
      'date-fns': {
          singleton: false,
          strictVersion: true,
          requiredVersion: 'auto',
          eager: true
        }
      })
    }),
  ],
};
```

So in your application you could do something like:

```typescript
import { format } from 'date-fns';

format(new Date(2014, 1, 11), 'MM/dd/yyyy');
```

and, webpack will automatically share `date-fns` between all your federated modules that define date-fns as a shared library. For more details,
please refer <a href="https://www.npmjs.com/package/@angular-architects/module-federation#sharing-libs-of-a-monorepo" target="_blank">@angular-architects/module-federation#sharing-libs-of-a-monorepo</a> and <a href="https://webpack.js.org/plugins/module-federation-plugin/" target="_blank">webpack's module federation plugin.</a>


**Deployment**

**Challenge:** Existing CI/CD pipelines are required to be modified.

**Solution:** Follow below steps to deploy micro frontends.

**Shell App Changes**

- Dynamic entry point for Remote app

``` typescript

export const RemoteAppRegistry = {
    'remoteApp': () => loadRemoteModule({
        remoteEntry: getRemoteUrl(),
        remoteName: 'remoteApp',
        exposedModule: './web-components'
    })
};

function getRemoteUrl() {
    if(!environment.isProduction) {
        return `http://localhost:${REMOTE_PORT}/remoteEntry.js`
    } else {
        // We need to configure REMOTE_BASE_PORT (optional) for local docker app testing.
        return '${PROTOCOL}//${HOSTNAME}:${REMOTE_BASE_PORT}${REMOTE_BASE_HREF}remoteEntry.js'
    }
}
```

- Add BASE_HREF in shell and remote application

``` typescript
 "architect": {
  "build": {
    "configurations": {
      "production": {
        "baseHref": "${BASE_HREF}",
      }
    }
  }
 }
```

- Modify entry point in webpack.prod.config.js

``` typescript
plugins: [
  new ModuleFederationPlugin({
    remotes: {
      "remoteApp": "remoteApp@https://${HOSTNAME}${REMOTE_BASE_HREF}/remoteEntry.js",
    },
  })
]
```

- Sample `docker.yaml`

```yaml
version: "3"

services:
  web:
    build:
      context: .
    ports:
      - target: 8080
        published: 8080
    environment:
      ...
      PROTOCOL: 'http:'
      HOSTNAME: localhost
      PORT: 8080
      BASE_HREF: /retail-shell/     
      REMOTE_BASE_HREF: /retail-journeys/
      REMOTE_BASE_PORT: 8081
```

- Sample Dockerfile

```Dockerfile
FROM repo.backbase.com/backbase-docker-releases/web-base:1.1.2
COPY ./retail-shell ./statics

```

**Remote App Changes**

- Modify webpack config to make public path dynamic

**Note:** TEST_PORT is required to run application on local docker env, However for production it will be 443 and hence can be removed.

```typescript
output: {
    uniqueName: "remoteApp",
    publicPath: "${PROTOCOL}//${HOSTNAME}:${TEST_PORT}${BASE_HREF}",
    module: true,
  },
```

- Sample docker.yaml

```yaml
version: "3"

services:
  journeys:
    build:
      context: .
    ports:
      - target: 8081
        published: 8081
    environment:
      ...
      PROTOCOL: 'http:'
      HOSTNAME: localhost
      PORT: 8081
      BASE_HREF: /retail-journeys/
      TEST_PORT: '8081'
      SHEL_BASE_HREF: retail-shell/
```



**Benefits & Drawbacks of using Micro Frontends:**

![](/assets/images/post/mf-pros-cons.png)


# Conclusion
Micro Frontends offer tremendous flexibility and scalability to developers and enterprise applications. With this architecture, individual teams can work and deploy features independently without affecting other features. However, the initial setup of Micro Frontends requires extra time to set up on developer machines as well as on pipelines. Despite this, the benefits of Micro Frontends architecture outweigh the drawbacks by a significant margin.