---

title: "Visual Testing using Playwright"
excerpt: "Visual testing helps to find issues that are important for end-users that cannot be caught by other types of testing"
tags: Testing, Quality Assurance
authors:
- Venkata Ravi Majjari
header:
  teaser: /assets/images/post/visual-testing-banner.png
  teaser_alt: Quality Assistance Approach
category: Software Quality Assurance

---

![](/assets/images/post/visual-testing-banner.png)

“**Visual testing**” is a software testing technique that evaluates the visible output of an app and compares that output against the results expected by a known-good source, such as a design mockup created in Photoshop or Figma, or a screenshot from a previous version of the same app.

Visual testing also aims to verify that the app’s **visual elements** like **colors, images, fonts, and layouts,** are displayed correctly and consistently across different devices, operating systems, and browsers.


## **Why is visual testing important?**

- Visual testing captures defects that other types of UI tests cannot
- Visual testing is essential for ensuring a positive user experience with your app
- Maintaining a visually perfect UI is important for retaining customers
- Visual testing is important to reduce the revenue impact

**List of Visual Bugs:-** below are the list of visual defects that may occur
- Pixel-by-pixel differences
- Alignment shifts
- Page layout
- Rendering problems
- Element overlap
- Responsive layout
- Font differences
- Color differences

**Example 1:- Element Overlap Scenario**

{% include
  components/figure.html
  url="/assets/images/post/visual-testing1.png"
%}

Look at this UI, how did this happen in production?
The text and advertisement are crammed together. If this was your advertisement, do you think there would be a revenue impact? Absolutely.

These aren’t cosmetic issues. In each case, **visual bugs are blocking revenue**.

Why do these visual bugs occur? Don’t they do functional testing? They do, but it’s not enough.

Many believe that functional tests are enough to catch visual bugs, but that is not true. Functional tests validate only the functional behavior of the app.

Visual bugs are rendering issues. And rendering validation is not what functional testing tools are designed to catch.

**Example 2:- Different visual bugs on each case**

{% include
  components/figure.html
  url="/assets/images/post/visual-testing2.png"
%}

In the preceding example each snapshot has rendered with different visual error.

## **How can Visual Testing help?**


{% include
  components/figure.html
  url="/assets/images/post/visual-testing3.png"
  description="Visual aspects of the quality"
%}

**Benefits of Visual Testing**

- Provide Confidence for visual aspects of the product that can’t be covered by lower level validations (Even by E2E)
- Easy to cover cases like RTL changes or Theming if already have original tests
- For some functional tests it is **faster to develop** Visual tests than functional
- **Maintenance of the visual tests can be cheaper than functional tests** (All you need is just update baselines, you have no dependencies to test ids and html structure)
<br>
<br>

## **Why can’t functional tests cover visual issues?**

Functional test scripts can validate the size, position, and color scheme of visual elements. But if we follow this approach, then our test scripts will soon balloon in size due to checkpoint bloat.

Let’s look at an Instagram advertisement screen that’s properly rendered:

{% include
  components/figure.html
  url="/assets/images/post/visual-testing4.png"
  description="Advertisement screen that has properly rendered"
%}

If we look at the advertisement, there are 21 visual elements, like various icons, text (—) this ignores iOS elements at the top like Wi-Fi signal and time, since those aren’t controlled by the Instagram app

Consider that each element has to be validated with all these 5 checkpoints:

- Visible [true/false]
- Upper-left x, y coordinates
- Height
- Width
- Background color

That means we need the following number of assertions in the test script:

**21 visual elements x 5 assertions per element = 105 lines of assertion code**

Even with all this assertion code, you wouldn’t be able to detect all visual bugs. Such as whether a visual element can’t be accessed because it’s being covered up in the DOM as hidden mode.

For each combination of **OS/browser/font size/screen size/screen orientation**. You could end up with thousands of lines of assertion code to be added in the test script, which is not a best approach to be followed.

**Hence, we need visual testing to catch all the visual errors and we cannot rely on functional tests to catch visual errors.**


## **What is Manual Visual Testing?**

Manual visual testing means comparing two screenshots manually, one from your known good baseline image, and another from the latest version of your app. For each pair of images, you have to invest a lot of time to ensure you’ve caught all issues. Especially if the page is long, or has a lot of visual elements, in that case it is very difficult to identify all the visual issues. 

{% include
  components/figure.html
  url="/assets/images/post/visual-testing5.png"
  description="Manual Visual Identification of the elements"
%}

**Challenges of manual Visual Testing:-**
Imagine you need to test your application on:

- 5 operating systems: windows, MacOS, Android, iOS, and Chrome
- 5 popular browsers: chrome, Firefox, Internet Explorer (Windows only), Microsoft Edge (Windows Only), and Safari (Mac only)
- 2 screen orientations for mobile devices: portrait and landscape
- 10 standard mobile device display resolutions and 18 standard desktop/laptop display resolutions from XGA to 4G

**1 Screen to test = 21 x (20+18) = 21 x 38 = 798 Unique Screen Configurations**

Let’s say if your application has 100 pages to test:

**798 Screen Configurations x 100 Screens in-app = 79,800 Screen Configurations to test**

Wouldn’t it be great if there was a way to automate this crazy-tedious process?

Well, yes there is… a process is in place to do the tedious 


Here we are with the problem statement from Visual Testing:

**🚨The problem** - Visual bugs are blocking revenue and resulting in not retaining customers.

**🎯The goal** - Visual testing captures defects that other types of UI tests cannot [Functional, Manual & Regression].

**💡The solution** - **Automated Visual Testing is a solution** and **Playwright** is one of the good option used in Backbase [**Applitools** or **Percy** are the other automated tools are available for visual testing]
<br>
<br>

## **Automated Visual Testing using Playwright**

To address the preceding challenges, automated visual testing needs to be implemented in place of ‘function testing’/’manual visual testing’ to **achieve efficient and reliable results in visual testing**.

- **Playwright** is an open-source test automation framework that enables end-to-end testing for modern web-apps
- It uses languages - JavaScript, TypeScript, Python, Java, and C#
- It also supports Chromium, Firefox, and WebKit-based browsers and can also run tests against an emulated mobile browser
- OS support - Windows, Linux, and macOS


**Snapshot Comparison Workflow:**

{% include
  components/figure.html
  url="/assets/images/post/visual-testing6.png"
%}

**Simple Visual Snapshot Comparison Tests in Playwright:**

{% include
  components/figure.html
  url="/assets/images/post/visual-testing7.png"
%}

When the **toHaveScreenshot()** function executes, it performs the following:


- It verifies if there is an existing screenshot file. If not present, it fails
- It takes a new screenshot
- It computes the difference between the two screenshots using the pixel match library
- If there is any difference, take another screenshot
- It computes the difference again
- It writes an expected, actual, and diff file to the test-results folder

{% include
  components/figure.html
  url="/assets/images/post/visual-testing8.png"
%}


{% include
  components/figure.html
  url="/assets/images/post/visual-testing9.png"
%}

## **Key benefits/take-aways from Visual Testing Approach**

- **Enhanced User Experience (UX):** Visual testing is crucial for a seamless and visually pleasing user experience, positively impacting satisfaction, reducing bounce rates, and reinforcing brand image.
- **Efficiency Through Automation:** Automated visual testing accelerates the detection and resolution of visual discrepancies, enhancing efficiency and accuracy in software development.
- **Cross-Platform Compatibility Assurance:** Visual testing ensures consistency across browsers and devices, expanding user reach and maintaining a uniform brand image.
- **Cost-Effective and Time-Efficient:** Automation in visual testing leads to significant time and cost savings compared to manual methods, allowing teams to focus on complex development tasks.
- **Integration with CI/CD:** Visual testing seamlessly integrates into CI/CD pipelines, supporting rapid, high-quality software delivery by validating visual aspects with each code change.
