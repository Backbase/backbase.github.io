---
title: "Angular: Deploy an Angular app on Azure"
excerpt: "Deploy a multi-locale Angular app using Azure Blob Storage and CDN Classic"
tags: Frontend Angular Azure i18n
authors:
- Yash Kapila
- Marco Santarelli
header:
  teaser: /assets/images/post/web-azure-angular-logo.jpeg
  teaser_alt: Azure and Angular
category: Frontend
---

![](/assets/images/post/web-azure-angular-logo.jpeg)

## Introduction

Backbase has been working towards a web architecture that follows [Jamstack](https://jamstack.org) principles and aligns with Angular best practices. Our goal is to ensure our web app's rendering strategy is decoupled from the backend and hosted on the best infrastructure possible.

As a first step in that direction, we replaced our Backbase proprietary app server (Portal) and moved to a lightweight **Nginx** web server. This brought several benefits:

1. Better performance: removing the server-side rendering ensured a low TTFB (Time To First Byte)
2. Improved Security
3. Cheaper infrastructure: we reduced our backend footprint and removed Portal and its dependent services
4. Quick and easy deployments
5. Scalability
6. Greater consistency with Angular's [deployment suggestions](https://angular.io/guide/i18n-common-deploy)

Using Nginx allowed our customers to take this strategy regardless of whether they were on-premise or using a cloud vendor. However, we also want to enable our customers to deploy their apps to cloud components, so they can leverage the extra benefit of using the provider's native components and save costs on CPU, memory, bandwidth, and computation time.

To explore how we could achieve this in our Angular applications, we created a demonstration application using Microsoft Azure's web app services.

## Leveraging Azure

Several Azure services can be used to serve and deploy static web applications:

- Azure Blob Storage
- Azure CDN (Classic, Verizon, and Akamai)
- Azure Front Door
- Azure Web App
- Azure Static Web App

Each service has its features and capabilities, so it's essential to choose one that best fits an application's needs and use case. For this demonstration, we decided to go with Azure Storage and CDN(classic).

Let's take a quick look into these services.

### Azure Blob Storage

Azure Blob Storage is a fully managed object storage service provided by Microsoft as part of the Azure Cloud platform. It allows developers to store and retrieve large amounts of unstructured data, such as images, videos, and documents, in a highly scalable and cost-effective manner.

One of the main benefits of using Azure Blob Storage is its ability to scale to handle large amounts of data. The service automatically scales up and down based on usage and can store billions of objects in a single account. Additionally, Azure Blob Storage is also cost-effective, and you only pay for the storage and data transfer you use.

Some of the use cases this service is designed for are:

- Delivering images or documents directly to a browser.
- Streaming video and audio.
- Storing files for distributed access.

For more information on Azure Blob Storage, read [Microsoft’s introduction](https://docs.microsoft.com/en-us/azure/storage/blobs/storage-blobs-introduction) to the service.

### Azure CDN

A content delivery network (CDN) is a vast network of servers responsible for delivering content from an "origin" server to end users from a location closest to them, ensuring minimum latency. It achieves this by storing cached content on edge servers in point-of-presence (POP) locations that are geographically closest to the end users.

Azure CDN (Classic) is a CDN service provided by Microsoft as part of the Azure Cloud platform. It supports multiple protocols, including HTTP and HTTPS, and is integrated with Azure storage, allowing to serve content from the Azure storage account using CDN efficiently. Some benefits of using Azure Classic CDN to deliver web applications include the following:

1. Better performance and improved user experience due to the speed of delivery of content.
2. Scaling to handle high instantaneous loads.
3. Taking pressure off the origin by distributing cached content from the Edge servers.

For more information on Azure CDN, read [Microsoft’s introduction](https://learn.microsoft.com/en-za/azure/cdn/cdn-overview) to the service.

#### Front Door (alternative)

While we use Azure CDN for this demo application, Azure Front Door provides similar functionality. Front Door is Microsoft's modern cloud Content Delivery Network (CDN) that provides a global, multi-cloud entry point for web apps. It offers features such as load balancing, built-in layer 3-4 DDoS protection, and the ability to define custom routing rules.

For more information on Front Door, read [Microsoft’s introduction](https://learn.microsoft.com/en-us/azure/frontdoor/front-door-overview) to the service.

#### Azure CDN from Verizon & Akamai (alternative)

Azure CDN from Verizon & Akamai is Microsoft's latest Azure Content Delivery Network (CDN) service version. It’s a global service that allows the distribution of content to users worldwide by caching and delivering the content from a network of edge servers located in strategic locations.

Azure CDN from Verizon is based on the Verizon Media Platform, a CDN service provided by Verizon Communications. Azure CDN from Akamai is based on the Akamai Edge Platform, which Akamai Technologies provide.

It allows us to choose the provider that best fits our needs and use case and also allows us to use different providers for different endpoints, giving more flexibility and control over the CDN service.

## Challenges

We identified a few challenges which needed to be resolved before our banking applications could be served and deployed using Storage and CDN:

1. Multi-locale support
2. CSP
3. Authentication (cookie vs header based)
4. Security

As part of this post, we will focus on addressing multi-locale support and CSP.

## Angular & Internationalization

**Internationalization**, sometimes referred to as i18n, is the process of designing and preparing an application for use in different locales worldwide, and **localization** is the process of building versions of the project for different locales. The method of determining the appropriate language and cultural settings for a user based on their device or browser settings, geographic location, or user preferences is termed **locale negotiation**.

At Backbase, our customers have users across multiple regions, requiring their banking apps to be localised. Leveraging in-built Angular capabilities, we can achieve this quickly by building different versions of an app for each locale.

For example, an app having two languages Dutch(`nl`) and English(`en`) will have a final distribution like the following:

```
- dist
  - azure-angular-i18n
    - nl
      - index.html
      - favicon.ico
      - main.5f84b2e1a0ac5bcdcd0e.js
      - ....
    - en
      - index.html
      - favicon.ico
      - main.5f84b2e1a0ac5bcdcd0e.js
      - ....
```

While building and managing i18n tasks is covered well by Angular documentation, there is limited information regarding deploying a multi-locale app and locale negotiation. The [Angular docs](https://angular.io/guide/i18n-common-deploy) only explain it for when using a web server like Nginx and Apache.

Web servers can perform a computation to determine the correct locale based on configured requirements. However, this implementation isn't as straightforward with a storage service and CDN, as neither provides any built-in computation capability.

To overcome this challenge, we used a feature in Azure CDN known as **Rule Engine**. Rule Engine allows defining of custom rules and actions that can be applied to requests and responses as the CDN processes them.

The rules can be applied based on various conditions, such as URLs, headers, query parameters, and cookies. They are associated with an action that can be taken on the request or response, such as caching, redirecting, rewriting, or adding headers. Find more information about it in [the Microsoft Azure docs](https://learn.microsoft.com/en-us/azure/frontdoor/front-door-rules-engine?pivots=front-door-standard-premium).

Some examples of things we can do with Rule Engine in Azure CDN are as follows:

- Serve a specific version of a file depending on the Accept-Language header.
- Add security headers to improve the security of content.
- Redirect users to a different URL based on the user's country or device type.
- Cache different versions of an asset based on the user's device or browser.
- Set custom headers or override existing headers.

### Demo Application

The source code for our demonstration application is available [here](https://github.com/Backbase/azure-angular-i18n), and the live application is available [here](https://angular-i18n-demo.azureedge.net).

**Disclaimer: This post is only for demonstration purposes and shouldn't be treated as production ready as it deals with basic locale negotiation requirements and lacks mandatory security aspects**

#### Prerequisites

1. [Microsoft Azure account, free tier](https://azure.microsoft.com/en-us/free/)
2. [Azure CLI]((https://docs.microsoft.com/en-us/cli/azure/install-azure-cli))
3. [Angular app](https://angular.io/guide/setup-local)

#### Project Setup

Following Angular [documentation](https://angular.io/guide/i18n-common-overview), the application is prepared for two languages, `en` and `nl`.

```json
{
  "projects": {
    "azure-angular-project": {
      "prefix": "app",
      "i18n": {
        "sourceLocale": "en",
        "locales": {
          "nl": "src/locale/messages.nl.json"
        }
      },
      "architect": {
        "build": {
          "options": {
            "localize": true
          }
        }
      }
    }
  }
}
```

The app retrieves dummy information from an API made available through an [Azure function](https://swapi-function-app.azurewebsites.net). The function serves two APIs: `/planets`, which gives a dummy list of Star Wars planets and `/planets/{planetId}`, which returns dummy information about the selected planet.

#### Prepare Angular distribution package

Angular generates a separate distribution package for each locale.

```bash
npm run build
```

#### Create Azure Resources

We provision the required resources using Azure's ARM templates (infrastructure-as-code) and AZ CLI. AZ CLI must have a default subscription set to provision resources.

**Resource Group**

A resource group is a container that holds all related resources for an Azure solution. All services provisioned for this demonstration application will be held inside the same resource group. We provision a resource group named `azure-angular-i18n` in the `West Europe` region.

```bash
az group create --location westeurope --name azure-angular-i18n
```

**Storage Account**

Using the [ARM template](https://github.com/Backbase/azure-angular-i18n/tree/master/azure_arm_templates/storage-account), we provision a storage account that will store the Angular builds named `angulardemoapps` and create two containers `en-locale` and `nl-locale` within it.

```bash
az deployment group create --resource-group azure-angular-i18n --template-file azure_arm_templates/storage-account/template.json
```

Next, we upload the `en` and `nl` Angular distribution builds to their respective containers.

```bash
# --account-name is the name of the storage account, and -d is the container name

az storage blob upload-batch --account-name angulardemoapps -d nl-locale -s dist/azure-angular-i18n/nl/ --overwrite

az storage blob upload-batch --account-name angulardemoapps -d en-locale -s dist/azure-angular-i18n/en/ --overwrite
```

**Important:** We set the `cache-control` property for both locale's `index.html` to `no-store` as we don't want the CDN to cache it once it is provisioned. Caching the file causes issues with locale negotiation, especially when determining the right locale based on an empty context root `/`.

```bash
az storage blob update --account-name angulardemoapps --container-name nl-locale --name index.html --content-cache "no-store"

az storage blob update --account-name angulardemoapps --container-name en-locale --name index.html --content-cache "no-store"
```

**CDN**

Once the storage account is setup, we provision a CDN using its [ARM template](https://github.com/Backbase/azure-angular-i18n/tree/master/azure_arm_templates/cdn).

```bash
az deployment group create --resource-group azure-angular-i18n --template-file azure_arm_templates/cdn/template.json
```

The ARM template contains the following configurations:

1. Specifies the **origin** where the original resources reside and are fetched by the CDN when a cache doesn't exist
2. Specifies the rules for the Rule Engine for locale negotiation. These rules are as follows:
    - If the context root of the application is empty (`/`), check for a cookie named `locale`. If the value is `en`, return `en/index.html`. If the value is `nl`, return `nl/index.html`.
    - For deep linking, if the URL path begins with `/en`, return `/en/index.html`. Otherwise, return `nl/index.html`.
    - For all assets like CSS, JS & SVGs, return them from their respective `en` or `nl` containers.
    - As a fallback, if locale negotiation using cookies or URL path isn't successful, return `en/index.html`.
3. Modifies the response header for `index.html` and adds a dummy Content-Security-Policy-Report-Only header.

## Final Thoughts

The post gives an idea of how Azure native components are used to deploy an Angular application. We can further optimise Azure CDN (Classic) and Blob Storage implementation for a real application.

Additionally, an exciting new feature is coming up on Azure known as [Edge Compute](https://azure.microsoft.com/en-us/resources/cloud-computing-dictionary/what-is-edge-computing/). Edge Compute will make it possible to provide computation capabilities on Edge Locations and so achieve a lot more than the Rule Engine. Since the feature is still new, it isn't available across all regions, but it is only a matter of time before it’s natively integrated with Azure's CDN solutions.