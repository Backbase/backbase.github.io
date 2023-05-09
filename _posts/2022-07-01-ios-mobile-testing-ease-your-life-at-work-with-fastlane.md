---
title: "Ease your life at work with Fastlane"
excerpt: "A brief overview of how we use fastlane in CI pipelines for iOS"
tags: Mobile iOS testing
authors:
- Dilshan Fernando
header:
  teaser: /assets/images/post/fastlane_banner.png
  teaser_alt: Ease your life at work with Fastlane
category: Software Quality Assurance 
---

![](/assets/images/post/fastlane_banner.png)

# As a software Tester, are you curious in finding the solutions to the below questions? (for iOS)
 - How to reduce test execution time by running in parallel on physical devices and simulators? 
 - How to generate test reports with screenshots and run tests via a command-line interface?
 - How development team can do their code analysis at early?
 - How can we execute Unit test before execute UI tests?
 - Finally, How can we include all of the above in Continuous Integration(CI) pipeline?

# Solutions we have introduced in Continuous Integration(CI) pipeline

<figure>
    <img src="/assets/images/post/ios_ci_process.png" >
</figure>

# Getting started 🎬

<p align="justify">
Fastlane is the easiest way to automate beta deployments and releases for your iOS and Android apps. 🚀 It handles all tedious tasks, like generating screenshots, dealing with code signing, and releasing your application.
</p>

## Fastlane for iOS 🍎

fastlane can be installed in multiple ways. The preferred method is with **[Bundler](https://bundler.io/)**. fastlane can also be installed directly through Homebrew (if on macOS). It is possible to use macOS's system Ruby, but it's not recommended, as it can be hard to manage dependencies, and causes conflicts.

Inorder to install, please follow the steps mentioned on the official site of **[fastlane](https://docs.fastlane.tools/getting-started/ios/setup/)**

Now we have Fastlane tools installed. You should have `fastlane` directory in your project with `Appfile` and `Fastfile` created.

# Executing tests via command line ⌨️

In order to run tests on the Continuous Integration Server, we need to execute them via a command-line interface. You will find multiple approaches for this task, in this tutorial we'll be using the Fastlane Scan action. 

Let's set it up:
 - Navigate to created fastlane directory `cd fastlane/`
 - Open `Fastfile` in text editor
 - Set scheme according to your project scheme name
 - Specify test device

```kotlin
lane :run_ui_tests do
    scan(
      scheme: 'ExampleFastLaneiOSUITests', # Project scheme name
      clean: true, # Clean project folder before test execution
      device: 'iPhone 8 plus' # Simulator for testing
    )
end
```
Well done, we have successfully configured our project to execute tests and Fastlane tools will do the rest for us. To run tests:

- Execute `fastlane run_ui_tests`
- Wait for tests to be executed

<figure>
    <img src="/assets/images/post/test_execution_in_simulator.gif" style="width:800px;height:400px;">
    <figcaption>Test execution in Simulator.</figcaption>
</figure>

You will find HTML and Junit reports generated in `fastlane/test_output` directory.

# Improving Test Reports 📖

Fastlane allows generating only simple test reports which do not include screenshots and device logs. When building the Test Automation framework we need to make sure, that the test report has enough information, so we don’t have to re-run tests manually and can analyze test failures more efficiently

The better approach is to use **[XCTestHTMLReport](https://github.com/XCTestHTMLReport/XCTestHTMLReport)**.

When we have it successfully installed the next step will be to add a helper method, so we can generate a report as a part of the test:

```kotlin
desc "Generate test reports"
  def generate_uiTestreport
    puts "Generating Test Report ..."
    sh 'xchtmlreport -r test_output/ExampleFastLaneiOSUITests.xcresult -i'
    puts "Test Report successfully generated"
  end
```

# Running tests in parallel on multiple devices

When testing Mobile Applications we need to verify that the Application works as expected on all supported devices and OS versions. Fortunately, we can automate this part with minimal effort. Parallel testing on simulators can be configured in Fastfile, we need to specify devices for testing

```kotlin
TEST_SIMULATORS = ['iPhone 8','iPhone SE (3rd generation)','iPad mini (6th generation)']
lane :uiTest do
    scan(
      scheme: 'ExampleFastLaneiOSUITests', # Project scheme name
      clean: true, # clean project folder before test execution
      devices: TEST_SIMULATORS 
    ) 
end
```

<figure>
    <img src="/assets/images/post/parallel_test_execution_simulators.gif" style="width:800px;height:400px;">
    <figcaption>Parallel Test Execution on Simulators.</figcaption>
</figure>

Unfortunately, testing on simulators won’t be always the best approach, cause some issues won’t be appearing. Testing on real devices will provide us with more accurate test results. Also, we need to disable Auto-Lock so that the device will always be ready for test execution:

- Navigate to the Display & Brightness section
- Set Auto-Lock to Never

To make sure, that system notification won’t affect test execution we need to enable Don’t disturb mode :

- Navigate to the Do Not Disturb section
- Enable Do Not Disturb mode
- Set Silence to always

The device is configured for test execution now. To execute tests on real devices we need to specify UDID. You can get it in multiple ways, for example, **[this](https://www.itexico.com/blog/find-unique-device-identifier-udid-on-the-iphone)**. Then we just need to set the physical device as the destination for testing.

```kotlin
REAL_DEVICES = [
    'platform=iOS,id=2a31ef65jc84c16er657af3f29901c20917g37',
    'platform=iOS,id=78a91ef5bf2036fa49ec3df1af356jh5676390'
  ]

private_lane :real_device_test do
    scan(
      scheme: 'ExampleFastLaneiOSUITests', # Project scheme name
      clean: true, # Clean project folder before test execution
      destination: REAL_DEVICES, # Devices for testing 
      result_bundle: "TestResults" # To generate test reports
    )
    generate_report
end
```

Tests will be executed on configured devices and a test report will be captured for each device.

> 📝 **Notes:**
>Sometimes you will need to add the following additional parameters
>
> - fail_build: false  #Otherwise following steps won’t be executed
> - disable_concurrent_testing: true  #to stop parallel execution and enable sequential testing order
> - testplan: “”  #define the test play you wish to execute (eg: smoke, regression,etc…)

Check out the **[list of all available parameters](https://docs.fastlane.tools/actions/run_tests/#parameters)**

# Next, we'll see how we can add a fastlane for SonarQube analysis

- Create a new text file called `Sonar`
- Add following code segment

```kotlin
desc 'run a sonar scan'
lane :sonar_analysis do |options|
  defaults = {
    project_key: "name.gretzki.awesomeApp",
    project_version: "1.0",
    project_name: "iOS - AwesomeApp",
    sonar_organization: "myOrg",
    sonar_login: "123456abcdef",
    sonar_url: "https://sonarcloud.io"
  }.freeze

  sonar(defaults.merge(options))
end
```

> ⚠️ **Warning:** Please update the Sonar values accordingly.


# Now Let's create the final fatslane workflow as showed

- Open the `Fastfile`
- Add following new lane

```kotlin
lane :pr_merge_on_develop do 
    sonar_analysis
    build
    run_unit_tests
    run_ui_tests
end
```
Now it's time to execute ` fastlane pr_merge_on_develop`

After a successful execution, HTML report will be generated with the test results for each device, as well as test logs with screenshots.

<figure>
    <img src="/assets/images/post/ios_test_report_example.gif" style="width:800px;height:400px;">
    <figcaption><em>Test Report example.</em></figcaption>
</figure>

<br>

# Conclusion 🔥

In this article, we have learned how to set up Fastlane for your iOS project and execute Xcode UI Tests in parallel on physical devices and simulators.

It will allow us to set up our test execution on a Continuous Integration server and attach advanced test reports, 
as well as increasing of test coverage and reduce manual compatibility testing effort. I hope now you can set Quality gates in your project CI pipeline. 🤗

**[Complete Test Framework setup example with Application Source Code is available on GitHub.](https://github.com/dilshan5/ExampleFastLaneiOS)**

If you need to build an advanced fastline pipeline for Continuous Deployment(CD), please refer **[“Beta Deployment”](http://docs.fastlane.tools/getting-started/ios/beta-deployment/)**


Happy Coding and Testing..!!! 😊 💻
