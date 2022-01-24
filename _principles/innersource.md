---
title: "InnerSource @ Backbase"
layout: single
excerpt: "Understand what InnerSource is and how Backbase uses it to create an environment where everyone participates in building one platform."
authors:
- Craig Walker
header:
  teaser: /assets/images/innersource.png
  teaser_alt: InnerSource Commons logo
  teaser_class: centered
---

## What is InnerSource?

InnerSource is the use of open source best practices and establishment of an open source culture — within an organisation like Backbase.

You may develop proprietary software, while opening up work between developers and teams.

With the increasing pace of technological change, internal communication and collaboration have become key competitive differentiators. Not only between technical teams in software, IT, security, or data science, but across entire organizations. It has never been more important to get everyone working better together.

By setting the default to open for projects within Backbase, we can enable reuse of existing solutions and minimize redundancy, empower and incentivize collaboration across teams, and leverage all the talent in Backbase.

## Benefits of InnerSource

Many benefits that are typical of open source development can be realized with InnerSource.

-   **Faster**, with quality: Unit tests, code coverage, and continuous integration help improve code earlier
    
-   **Documentation:** Code is better documented, both in comments and less formally in discussions
    
-   **Code reuse:** Code and architecture are discoverable and available across teams and the organization
    
-   **Collaboration:** Friction reduced for code review, communication, and contributions in and between teams
    
-   **Culture:** Silos broken down, happiness improved and with that, better retainment and recruitment
    

----------

## InnerSource Principles

-   **Everyone can contribute:** Many organizations assume that software engineers should be the only direct contributors to software projects. Let’s think of everyone as a contributor. Their contributions may be code, bug fixes or reports, copy edits, or simply informed user opinions in comment threads. Welcome them all.
    
-  **Establish maintainer roles:** Product Owners and teams are elevated to manage contributions.
    
-   **Open up projects:** Give as many people in your organization access to as many projects as you can. Not just code repos, but designs, roadmap, requirements and pipelines.
    
-   **Make it easy to take part:** Make contributing easy, add the basic training they need to make contributions and give confidence to have clear successful contribution criteria.
    
-   **Paying it forward:** When the pressure is on and you really want to get something done but you are blocked by a bug / feature from another team. Don’t panic, you can do it. In planning we would often point out dependencies as risks and increase the estimation, we do the same here just by assuming you don’t have to wait for the fix but then you may spend some time fixing it yourself. It’s a paying that forward thing! The same goes for others contributing to your repos too.
    

Learn more with [this getting-started guide by O’Reilly editor Andy Oram](https://www.oreilly.com/radar/getting-started-with-innersource/) and [What does it mean to be a maintainer?](https://opensource.guide/best-practices/)

----------

## How to InnerSource?

It's all about being a **good InnerSource Citizen** and understanding your colleagues. Here are a few examples you should consider:

-   **Maintainers own the vision, planning, releases and roadmap:** Our POs always determine the priorities of their teams backlogs and components they work on. For InnerSource your team's outlook doesn’t change; they still own this. However, they do need to consider serving their community contribution so that contributors understand before putting in the effort that it will be accepted or not? Then, once made those requests are reviewed quickly.
    
-   **Contributors should check before working on something big:** A typical bug fix or small refactoring if done correctly should always be welcomed. Also sharing great ideas are welcomed too, but when making a big change there will be an impact. The change could require documentation, regression testing and alignment with the vision or architecture with the Maintainers. In the end, the Maintainer (PO and optionally Principal Engineer) needs to decide whether a change aligns with the vision or not. It would always be best to plan it / refine it with the accepting team.
    
-   **Contributors do not add tech debt:** If you think about it, at first it seems that you are helping when you create something that was a lot of work but you know will add a lot of value. But what if the code you add is not complete? Maybe it's not documented, the code is not commented on, the e2e tests are not complete, there's an accessibility bug or a compile warning. The team accepting your code would then be accepting to finish the job on top of the plan they already have. So, in order to be successful in InnerSource we must ensure that what we give to a team is of the best possible quality.
    
## Best Practices

### Examples when has Backbase already been successful with working in a similar way

Contributing to open source projects like Angular, Bootstrap, WebDriver.io, Keycloak are just a few major libraries we have had successful contributions to very recently. Kudos to those who gave it a go: Aly Ahmed, Jordy de Jong, Marco Santarelli.

Internally our Design System is a combination of several shared libraries with distributed roadmaps and maintainers with RnD. Specifically, the Web UI library has several different contributors for over 77 Components across 25 teams, many reviewers from the RnD community and a dedicated team as the owner and maintainer of the library. Many teams have dependancies with Web UI and with this scale it helps us to cut out the middleman, it is just as important to do this smaller projects too. Take for example, Engineering.backbase.com, without the repo maintainers making this web site easy to work with I'd have never been able write this article. Thanks Robinson! 

### Examples of cases where contributions need alignment

Contributors know when to ask

-   I’ve made a PR but the team has no time to review my code and it will result in merge conflicts soon.
    -   If your contribution is time critical or large enough to conflict with others you should always check with the PO and Developers when is a good time.
    

-   I’ve made a PR but I haven’t time to complete writing the E2E test or documentation.
    -   It’s a gamble if you haven’t agreed someone else will write the E2E and documentation. They may like what you have done but have already customer commitment they can not change
    

-   I’ve created a new REST API but the team is now discussing the design in my PR
    -   If you have made significant changes and the technical implementation details were not agreed to enough detail with the team they are likely to want changes. After all, when a customer asks them why they designed the API this way they want to give the answer they are happy with.
    

Maintainers set up of self service or be ready to support

-   Our repo keeps getting PR’s that don’t meet our definition of done and we don’t have time to help them
    -   If your contribution guidelines are made clear and someone has contributed without following them you can choose to accept what's done or ask the contributors to follow the guidelines first.
    -   If you have no guidelines it's much more unpleasant to turn away contributions that are trying to help, don’t expect the community to want to help if it's unclear what to do.
    

-   We don’t have everything readily automated so that a PR will run all the test we need, also we need another PR made to the documentation repo also
    -   As long as these steps are clear in the contribution.md it the choice of the contributor if they are able to meet your criteria. You can always welcome them to first ask and then work on a branch together.    
    -   Again, if you have no guidelines it's much more unpleasant to turn away contributions that are trying to help, don’t expect the community to want to help if it's unclear what to do.
    -   It will help to reduce the effort, be combining steps and ensuring automated tests are run as part of your PR pipeline and not afterwards
    
Inner sourcing is not compulsarly here at Backbase its a choice and we'd liked to to have considered what are your options. If you can **pay it forward** and make it easy for others you'll be helping us all improve.

<!-- vale off -->
Here, you make it happen!
<!-- vale on -->
