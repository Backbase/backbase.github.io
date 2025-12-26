---
title: "Introducing Variants"
excerpt: "_Variants_ is a command line tool to set up deployment variants and provide working CI/CD setup for iOS and Android projects."
tags: Mobile Tooling Swift iOS Android CLI CI-CD Variants
authors:
- Arthur Alves
header:
  teaser: /assets/images/post/05_variants_teaser.png
  teaser_alt: Variants logo
category: Mobile
---

![Variants logo](/assets/images/post/05_variants_header.png)

[Variants](https://github.com/Backbase/variants) is a command line tool that aims to _**facilitate the setup and usage of multiple deployment variants**_ for a mobile application (iOS and Android) while also _**providing a fully working and rich Fastlane setup**_, with opt-in features for your pipelines. While achieving these goals, it also reduces the amount of sources of truth in your configuration, by relying only on the _Variants Spec_ - `variants.yml`, a YAML configuration file.


## **What problems does Variants solve?**

Before jumping into specifics of the tool and its features, I'd like to tackle two important questions; _what problems does Variants solve?_ and _who is it likely for?_.

We are not the first nor the only ones with the need to provide multiple variants of an application to satisfy business requirements or to test our apps against multiple backend environments (i.e.: one app that uses a backend environment meant for development, another meant for quality assurance, one for staging and one for production - and potentially more.). This problem can be easily achievable with Android Product Flavors and, for iOS, multiple Targets - or even one target with multiple `xcconfig`s. The same statement applies when it comes to Continuous Integration and Continuous Delivery; there are tools and platforms out there that one can use without reinveting the wheel.

To understand why this tool even exists we need to look beyond the core problems it attempts to solve and look at some special scenarios that **might only be applicable within Backbase**.

## **What made us bring this tool to life?**

Within Backbase's Customer Success department (_CS_, for short) - the department mostly responsible for bringing customer's projects to life and often maintaining them - we deal with dozens of projects every day. Projects for financial institutions worldwide, ranging from small credit unions to tier 1 banks; from the Americas to Asia, passing through Europe, Middle East and Africa. Beyond the existing ones we're required to create new projects every month.

These projects are in many ways unique but they have plenty in common still. One of the common things is how many variants we usually have for these apps, the requirement to ensure the quality of these codebases through CI and to which stores they are deployed through CD. 

A visualization of such a project and the deployment variants produced from the same codebase can be seen below.

![Visualization of a project with multiple deployment variants and their differences](/assets/images/post/05_multiple_variants_visualization.svg)

In this example scenario for an iOS application, we build and test our app locally using a `DEV` variant, which connects to our backend services at `https://dev.bb.com`; contains a few production features turned off; is signed using an Apple Developer account for organizations; uses a very specific app name, ID and icon and is never deployed.

When merging pull requests into our `develop` branch in the remote repository, we'd like our CI to automatically deploy our app as well, but this time using a `QA` variant, that connects to backend services with a different base URL; is signed using an **Apple Enterprise account**, also has different app name, ID and icon and is deployed to AppCenter.

You'll notice that when pushing changes to any `release/` branch or `main` it will do similar things, each with their own variant, which among other things would signing the application with different developer accounts and deploying to different stores.

## **What if all this could be done from one source of truth?**

#### **variants.yml**

Our source of truth is supposed to encapsulate basic information about the project, the amount of variants we set for it and their differences, but also include signing configuration globally.

In order to generate `variants.yml` for your project, we need to run the following command within the project directory:
```bash
# Automatically detect platform
$ variants init

# Specify platform (in case there are projects for different platforms in the working directory, this will be mandatory)
$ variants init --platform ios
```

It will generate `variants.yml` in the base folder:

![Illustration of variants YAML relative to the project's folder](/assets/images/post/05_variants_init.png)

#### **Using `variants.yml` with our BBApp**

For iOS, most information in the generated `variants.yml` would be pre populated. At this stage, we'd ensure the project information is correct and add a few things to our existing (default) variant - such as the `BASE_URL` - through a custom configuration whose destination is `project` (setting to `project` allows this config to be used in our codebase) and set a global `signing` configuration (note that it sits outside of the `variants` section, therefore applying to all variants).

This is what it would look like for our BBApp project:

```yaml
ios:
    xcodeproj: BBApp.xcodeproj
    targets:
      SampleProject:
        name: BBApp
        bundle_id: com.bb.bbapp
        test_target: BBAppTests
        app_icon: AppIcon
        source:
          path: Sources
          info: Sources/Info.plist
          # Path to folder that will serve as parent to folder Variants/
          config: Sources
    variants:
      # Default variant is mandatory, do not remove
      default:
        version_name: 0.0.1
        version_number: 1
        store_destination: AppStore
        custom:
            - name: BASE_URL
              value: https://prod.bb.com/
              destination: project

    signing:
        match_url: "git@github.com:sample/match.git"
        team_name: "iPhone Developer: Backbase Organization"
        team_id: "ABC1234567D"
        export_method: "appstore"

```

#### **Now what?**

It is time to actually setup our project. This is done a single time with the command [variants setup](https://github.com/Backbase/variants/blob/main/docs/USAGE.md#setup-multiple-build-variants-with-full-fastlane-integration).
The `setup` command is also able to detect the platform. If both iOS and Android projects exist in the current directory you'll be asked to specify one with the argument `-p, --platform <platform> 'ios' or 'android'`.

This command will make changes to your project so that:
* Data can be read from `variants.yml`;
* Your project can make use of custom configuration whose destination is set to `project`; and
* It will provide a fastlane setup for you. This already contains features for your CI, including the ability to `build`, `test`, `lint`, `deploy` (to multiple stores) and others.

You can opt out from setting up `fastlane` if you prefer to do things manually, by using the flag `--skip-fastlane` when running `variants setup`.

![Changes in your project folder after running the command variants setup](/assets/images/post/05_variants_setup.png)

> ***NOTE**: You'll likely want to commit these changes now ;)*

#### **Adding new variants**

Above we have finished the setup of our project using only one variant, our production one. We've also ommited other configurations for the sake of simplicity and kept only `BASE_URL`.

Now, we'll introduce new variants and make use of the ability to sign them with different developer accounts and deploy them to different stores. We can start with our `QA` variant, but let's focus only on our `variant` section in the following snippets.

Right now, this is what our yaml spec looks like:
```yaml
ios:
    ...

    variants:
     	# Default variant is mandatory, do not remove
    	default:
	        version_name: 0.0.1
	        version_number: 1
	        store_destination: AppStore
	        custom:
	            - name: BASE_URL
	              value: https://prod.bb.com/
	              destination: project

    signing:
    	...
```

Adding a new variant is very simple.
```yaml
ios:
    ...

    variants:
     	# Default variant is mandatory, do not remove
     	default:
	        version_name: 0.0.1
	        version_number: 1
	        store_destination: AppStore
	        custom:
	            - name: BASE_URL
	              value: https://prod.bb.com/
	              destination: project

     	QA:
	        version_name: 0.0.1
	        version_number: 1
	        store_destination: AppCenter
	        app_icon: AppIcon.qa
	        custom:
	            - name: BASE_URL
	              value: https://qa.bb.com/
	              destination: project  

    signing:
    	...
```

Note that we've added an optional configuration - `app_icon`, considering we have an extra app icon asset in our codebase with this name. If no `app_icon` was set for `QA` it would use the default one. `store_destination` has changed to `AppCenter` and the value of our custom config `BASE_URL` has changed.

At this step, all I have to do is to make sure that all my variants contain the same items in their custom configuration section and instead of using a hardcoded values in my codebase, I use the following:
```swift
let baseUrl = Variants.configuration["BASE_URL"]
```

#### Switching between variants

Our default variant is `default`, which is used for `production`. We change it to `QA` with the command [variants switch](https://github.com/Backbase/variants/blob/main/docs/USAGE.md#switch-variants).

It can be used as following:
```bash
# Automatically detect platform
$ variants switch --variant beta

# Specify platform (in case there are projects for different platforms in the working directory, this will be mandatory)
$ variants switch --variant beta --platform ios
```

The flag `--variant` can be ommitted. In that case it will fallback to `default`.

### Signing Configuration

Making use of the signing configuration (which uses Fastlane Match and the `fastlane` setup produced by `variants setup` already supports this) to sign our application is handy even if we only have the `default` variant. As we see below, it usually sits on the same level as `variants` section:

```yaml
ios:
    ...

    variants:
        ...

    signing:
        match_url: "git@github.com:sample/match.git"
        team_name: "iPhone Developer: Backbase Organization"
        team_id: "ABC1234567D"
        export_method: "appstore"
```

However, in our initial scenario, we'd like to sign our application with different developer accounts, using different export methods too. This is achieved by overriding the `signing` configuration on a `variant` level. Using our QA variant as an example, this would look like this:


```yaml
ios:
	...

	variants:
		default:
	        version_name: 0.0.1
	        version_number: 1
	        store_destination: AppStore
	        custom:
	            - name: BASE_URL
	              value: https://prod.bb.com/
	              destination: project

     	QA:
	        version_name: 0.0.1
	        version_number: 1
	        store_destination: AppCenter
	        app_icon: AppIcon.qa
	        custom:
	            - name: BASE_URL
	              value: https://qa.bb.com/
	              destination: project
	        signing:
	        	match_url: "git@github.com:sample/enterprise-match.git"
		        team_name: "iPhone Developer: Backbase Enterprise Organization"
		        team_id: "JKI1234567F"
		        export_method: "enterprise"

    signing:
        match_url: "git@github.com:sample/match.git"
        team_name: "iPhone Developer: Backbase Organization"
        team_id: "ABC1234567D"
        export_method: "appstore"
```

Now our `QA` variant has its own `signing` configuration, which uses a different match repository, developer account and export method.

#### Deploying

Given both variants above, whenever we want to deploy our applications we can make use of the already provided fastlane setup, running the `deploy` lane.

```bash
fastlane deploy
```

Our deploy lane will take into account the signing configuration of the active variant in order to know what to use to sign our app and to which store it should be deployed.

In order to make use of the fastlane setup generated by `variants setup` one still needs to cater for some parameters (often provided via environment variables) that can be found in `fastlane/parameters`. Some of those parameter files or part of them are generated automatically during `variants setup` and `variants switch`, such as `fastlane/Matchfile`.

More information regarding the generated fastlane folder can be found in [Variants' Templates folder](https://github.com/Backbase/variants/tree/main/Templates)

### BBApp

The final `variants.yml` for our sample project `BBApp` would be:

```yaml
ios:
	xcodeproj: BBApp.xcodeproj
    targets:
      SampleProject:
        name: BBApp
        bundle_id: com.bb.bbapp
        test_target: BBAppTests
        app_icon: AppIcon
        source:
          path: $(SRCROOT)/Sources
          info: $(SRCROOT)/Sources/Info.plist
          # Path to folder that will serve as parent to folder Variants/
          config: $(SRCROOT)/Sources

	variants:
		default:
	        version_name: 0.0.1
	        version_number: 1
	        store_destination: AppStore
	        custom:
	            - name: BASE_URL
	              value: https://prod.bb.com/
	              destination: project
	            - name: ENABLE_SSL_PINNING
	              value: true
	              destination: project
	            - name: ENABLE_DEBUG_MODE
	              value: false
	              destination: project
	            - name: ENABLE_CONFIG_ENCRYPTION
	              value: true
	              destination: project


	    STG:
	        version_name: 0.0.1
	        version_number: 1
	        store_destination: TestFlight
	        app_icon: AppIcon.stg
	        custom:
	            - name: BASE_URL
	              value: https://stg.bb.com/
	              destination: project
	            - name: ENABLE_SSL_PINNING
	              value: true
	              destination: project
	            - name: ENABLE_DEBUG_MODE
	              value: false
	              destination: project
	            - name: ENABLE_CONFIG_ENCRYPTION
	              value: true
	              destination: project
	        signing:
		        export_method: "development"


     	QA:
	        version_name: 0.0.1
	        version_number: 1
	        store_destination: AppCenter
	        app_icon: AppIcon.qa
	        custom:
	            - name: BASE_URL
	              value: https://prod.bb.com/
	              destination: project
	            - name: ENABLE_SSL_PINNING
	              value: false
	              destination: project
	            - name: ENABLE_DEBUG_MODE
	              value: true
	              destination: project
	            - name: ENABLE_CONFIG_ENCRYPTION
	              value: false
	              destination: project
	        signing:
	        	match_url: "git@github.com:sample/enterprise-match.git"
		        team_name: "iPhone Developer: Backbase Enterprise Organization"
		        team_id: "JKI1234567F"
		        export_method: "enterprise"


		DEV:
	        version_name: 0.0.1
	        version_number: 1
	        store_destination: AppCenter
	        app_icon: AppIcon.dev
	        custom:
	            - name: BASE_URL
	              value: https://prod.bb.com/
	              destination: project
	            - name: ENABLE_SSL_PINNING
	              value: false
	              destination: project
	            - name: ENABLE_DEBUG_MODE
	              value: true
	              destination: project
	            - name: ENABLE_CONFIG_ENCRYPTION
	              value: false
	              destination: project
	        signing:
		        export_method: "development"

    signing:
        match_url: "git@github.com:sample/match.git"
        team_name: "iPhone Developer: Backbase Organization"
        team_id: "ABC1234567D"
        export_method: "appstore"
```