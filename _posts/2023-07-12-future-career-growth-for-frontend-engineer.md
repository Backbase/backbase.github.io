---
title: "Future career growth for Frontend Engineer: aspects which you need to know besides frontend"
excerpt: "Self-development tips for frontend developers"
tags: Web Frontend Career Development
authors:
- Oleksii Horbunov
header:
  teaser: /assets/images/post/future-career-growth-for-frontend-engineer/teaser.jpg
  teaser_alt: Self-development tips for frontend developers
category: Frontend
---

## Introduction

Many individuals who are reading this article now - new in a frontend development or experienced frontend engineers. And many experienced developers start to think “What is next? What do I need to learn to be a Senior or Architect?”. Switching to the new seniority level is not only about better knowledge of JavaScript/TypeScript or new framework, it’s about communication, ability to analyse situation from the third person, more complex task. Moreover, the primary role has exactly “growth in width” - acquiring with the ecosystem, obtaining skills in related technologies and automatisation. In this article I will tell you what, in my opinion, every frontend developer aspiring to new career heights needs, and I will also share materials that have helped me personally.

In comments please leave your thoughts and I will be pleasant to read about your experience.

## Ok, let’s start

### 1. CI/CD, GitHub/GitLab actions, etc.

![](/assets/images/post/future-career-growth-for-frontend-engineer/ci-cd.png)

On each project I worked on was a specific system for the automation of various processes: from lint the code to deploying code to different environments and releases. Automated processes became to our life and are the guarantee that pushed and deployed code on production app will be robust, they protect us from human mistakes. In many projects I participated we had a DevOps or System Engineer in our team, but there have been situations with me when the project structure has changed and some of the processes need to be refactored. Also I was in a situation where developers set up just infrastructure and developers needed to create pipelines based on some short guide. Experienced developer (frontend, backend, game developer, etc) should understand the structure of pipelines on his/her project and be able to construct new pipelines (it’s often needed in the time of setup a new repository/part of the product)

**Example from the real life:**

Before Backbase I’ve worked in a startup-platform about mental health. When I came to the startup, the whole development of two mobile applications on React has already been going on approximately a couple of month and I identified a crucial challenge - the lack of an efficient and automated development process. Manual deployments were time-consuming and error-prone, hindering productivity and threatening the app's stability.

So, I decided with my colleague to automate many processes using GitHub CI/CD tools

We crafted a robust CI pipeline that would automatically build, test, and analyze the codebase with every new commit pushed to the repository. The pipeline would be triggered by any changes in the main development branch.

The pipeline's steps included:

1. Cloning the repository and installing dependencies.
2. Running automated unit tests to ensure code correctness.
3. Performing linting checks to maintain code style and quality.
4. Building optimized production-ready bundles for two mobile apps.

With each successful execution of the CI pipeline, the team could rest assured that the codebase remained stable and free from critical issues.

With the CI pipeline in place, we turned their focus to Continuous Deployment. The goal was to automate the deployment process to various environments, such as staging and production, while maintaining a tight control on version releases.

Alex set up a CD pipeline that would:

1. Push approved changes to a staging environment for thorough testing.
2. Run automated integration tests in a replica of the production environment.
3. Generate release artifacts upon successful testing.

And, for the cherry on top, we incorporated a notification system that would notify the team whenever a deployment occurred or if any issues arose during the CI/CD process 🙃. All messages was transferred to corresponding chats in Slack.

**Useful materials:**

- [https://docs.github.com/en/actions/quickstart](https://docs.github.com/en/actions/quickstart)
- [https://towardsdatascience.com/github-actions-everything-you-need-to-know-to-get-started-537f1dffa0ed](https://towardsdatascience.com/github-actions-everything-you-need-to-know-to-get-started-537f1dffa0ed)
- [https://www.youtube.com/watch?v=R8_veQiYBjI](https://www.youtube.com/watch?v=R8_veQiYBjI)
- [https://blog.maximeheckel.com/posts/building-perfect-github-action-frontend-teams/](https://blog.maximeheckel.com/posts/building-perfect-github-action-frontend-teams/)

**Real example**
- [Basic GitHub actions with Angular](https://betterprogramming.pub/how-to-build-and-deploy-an-angular-application-directly-from-github-a0aa5f28e6aa)

### Cloud-infrastructure (Amazon Web Services, Google Cloud Platform, Azure)

![](/assets/images/post/future-career-growth-for-frontend-engineer/azure.png)

Over the last few years life has significantly changed. More and more complex applications are shipping by different teams around the world and fewer companies want to worry about infrastructure. International companies want to make infrastructure more scalable, have services to store passwords securely, handling events, notifications, etc. Companies such as Google, Amazon and Microsoft have taken care of this and created their platforms to support applications of any type.

And every experienced Frontend Engineer should be able to perform basic operations with cloud-based platforms, and understand how is working his/her project within cloud-providers integration. Not obligatory to deeply understand everything. You can choose AWS/Microsoft Azure/Google Cloud platform as a basis, similar solutions from similar services will have similar structure and ways of working. For practice purposes, you can create a free account and write a mini full-stack application, which will touch as many as possible services of concrete cloud service provider

This valuable experience will give you an introduction to huge services work inside and will motivate you to understand better the internal organisation of the project you are working and, probably, will make you think about ways to improve it. The pattern of the interaction between the server and client, and various additional services will be clearer, and this is one of the first steps towards understanding and building the architecture.

P.S Also Google, Amazon and Microsoft provide certifications of various levels for developers, you may want take one.

**Example from the real life:**

In my thrilling journey as a developer 😅, I embarked on a project that involved creating a Telegram bot for a company specializing in selling clothes and shoes. Building a seamless and responsive frontend application for bot using Next.js was our top priority, and we needed a powerful deployment solution that could handle the demands of our fast-growing user base. AWS Amplify emerged as the perfect match for our requirements, offering a seamless deployment experience and a wide range of benefits.

With AWS Amplify, deploying our Next.js-powered Telegram bot became a breeze. The Amplify Console provided a user-friendly interface, allowing us to connect our code repository and set up continuous deployment with just a few clicks. Every time we pushed changes to our Git repository, Amplify automatically triggered the build and deployment process, ensuring that our users always had access to the latest features and improvements.

One of the standout features of AWS Amplify was its ability to handle serverless functions effortlessly. We leveraged this capability to integrate the bot with various third-party services, enabling smooth payment processing and real-time inventory updates. Amplify's serverless architecture was not only cost-effective but also highly scalable, ensuring that our Telegram bot could accommodate any surge in user activity during flash sales or promotional events.

Without knowledge of AWS services, for development and deployment of the new application for bot could be challenging and I most likely it would be necessary to look for a person who can deploy the frontend on the cloud provider.

**Useful materials (Yes, all links bound to AWS, because I prepared to AWS developer associate certification and passed it):**

- [https://www.udemy.com/course/aws-certified-developer-associate-dva-c01/](https://www.udemy.com/course/aws-certified-developer-associate-dva-c01/)
- [https://www.udemy.com/course/aws-certified-developer-associate-practice-tests-dva-c01/](https://www.udemy.com/course/aws-certified-developer-associate-practice-tests-dva-c01/)
- [https://www.udemy.com/course/aws-developer-associate-practice-exams/](https://www.udemy.com/course/aws-developer-associate-practice-exams/)
- [https://aws.amazon.com/getting-started/hands-on/build-react-app-amplify-graphql/](https://aws.amazon.com/getting-started/hands-on/build-react-app-amplify-graphql/)

**Real examples**
- [Angular Application Deployment to Azure Web App using GitHub](https://blog.devgenius.io/angular-application-deployment-to-azure-web-app-using-github-49a4e3a7ba87)
- [Deploy Angular application to Microsoft Azure](https://limeii.github.io/2022/11/deploy-to-azure-appservice-with-github-actions/)

### English

![](/assets/images/post/future-career-growth-for-frontend-engineer/english.png)

Yes, it’s drastically trivial advice. You probably heard about it a lot of times and have really high level of proficiency, but I need to say that. With accumulation of experience and seniority you are receiving more and more responsibility for decisions on your current project. So, you will have more communication with managers/product owners and business analysts. And a high level of English proficiency becomes vital. The most effective way to increase your language skills - visit of speaking clubs (maybe, even from your current company) or individual classes with native speaker. The more fluently I began to speak English, the more intense my professional life became, just trust me, it’s definitely true 😎.

**Useful advices:**

- Switch to English content if you are not a native speaker. It will increase your knowledge level and also you will discover a lot of interesting articles and videos.
- Just try to visit Speaking-clubs, in big cities you can find them easily, you can meet a lot of acquaintances and your English will be more fluent.
- If you have time and opportunity - you can pass the IELTS exam. Now I’m preparing for this exam and really made my vocabulary richer during the last few months and increase level of my grammar.

### Master design patterns

![](/assets/images/post/future-career-growth-for-frontend-engineer/design-patterns.png)

Design patterns are solutions to common problems in software development. And the ability to use them in real development will help you save time, create standards for your code using popular practices and significantly increase the scalability and maintainability of your application.

I highly recommend such a resource for learning patterns as [https://refactoring.guru/design-patterns/catalog](https://refactoring.guru/design-patterns/catalog). You can find here the description and implementation of patterns for software development. Having a got acquainted with patterns I really began to write better code, and most importantly make my components/services more scalable and not get into situations when you’re saying to your manager “We need to rewrite half of the application to implement this feature 🙃”. And I continue to study and repeat design patterns from time to time.

**Useful materials:**

- As I mentioned above [https://refactoring.guru/design-patterns/catalog](https://refactoring.guru/design-patterns/catalog)
- [https://www.freecodecamp.org/news/4-design-patterns-to-use-in-web-development/](https://www.freecodecamp.org/news/4-design-patterns-to-use-in-web-development/)
- [https://dev.to/lukocastillo/most-common-design-patterns-for-front-end-with-javascript-real-world-examples-2hj3](https://dev.to/lukocastillo/most-common-design-patterns-for-front-end-with-javascript-real-world-examples-2hj3)
- [https://frontendmasters.com/courses/tour-js-patterns/](https://frontendmasters.com/courses/tour-js-patterns/)

### Frontend applications architecture

![](/assets/images/post/future-career-growth-for-frontend-engineer/frontend-architecture.png)

With increasing seniority and years of experience frontend developer could be assigned to setup or support group of repositories, which are related to one or different parts of the project

Experienced frontend developers need to understand how to build a web-application which will satisfy the following criteria:

- Easy expansion of the application functionality;
- Convenient process of making changes inside the app;
- Consistent app structure;
- Fast onboarding process for new team members;
- Understandable logically separated code
- Writing new feature developer instantly understand where it will be placed in the file structure

Having considered several approaches such as Domain-Driven Design, Feature Sliced Design and others - you will have a variety of choices for support and setup specific project, it will definitely affect the quality of development speed and will also perfectly show you as a specialist.

**Useful materials:**

- [https://feature-sliced.design/](https://feature-sliced.design/)
- [https://michalzalecki.com/elegant-frontend-architecture/](https://michalzalecki.com/elegant-frontend-architecture/)
- [https://bespoyasov.me/blog/clean-architecture-on-frontend/](https://bespoyasov.me/blog/clean-architecture-on-frontend/)
- [https://www.youtube.com/watch?v=c3JGBdxfYcU](https://www.youtube.com/watch?v=c3JGBdxfYcU)
- [https://mobidev.biz/blog/web-application-architecture-types](https://mobidev.biz/blog/web-application-architecture-types)

### Mentor and interviewer skills

![](/assets/images/post/future-career-growth-for-frontend-engineer/mentor-interview-skills.png)

Who, if not a confident middle and senior, will hand over the best practices for writing applications to juniors and interns. Proper code review, discussions of tasks and solution approaches will help colleagues solve tasks faster and increase the expertise of the team. Moreover, there is a chance to transfer best practices to junior colleagues and thereby contribute to the IT community, making it more conscious and professional.

With a new grade frontend developer can be frequently involved in some company initiatives, the most popular is to be a technical interviewer with potential employees. Experienced developer knows how to mark strong and weak parts in candidate’s knowledge and can organise a process for faster onboarding new team member in technical and social processes.

**Example from the real life:**

Last year I was involved to Levi9 frontend academy, program for beginner programmers. The main goal was teach new people how to develop web-applications and then hire them for the several projects.

My journey as a mentor has been deeply rewarding, allowing me to share my knowledge and expertise with aspiring professionals and witness their growth from the first side. One of the essential skills I bring to my mentoring role is effective communication. I understand the importance of clear and empathetic communication in nurturing a supportive learning environment. By actively listening to mentees' concerns and questions, I tailor my guidance to their unique needs, fostering a sense of trust and collaboration.

Additionally, my technical skills have been instrumental in helping mentees navigate their career paths and solve complex challenges. Moreover, my experience as a mentor has taught me the importance of patience and adaptability. Every mentee has their pace and learning style, and I continuously try to adapt my approach to ensure that each individual feels empowered and valued on their growth journey within the company.

It was an amazing experience and I will definitely participate in similar events.

**Useful advices:**

- Become a mentor within your company for someone, try to understand individual’s goals, try to help him and highlight the results.
- Contact your HR department and take participation in the technical interview process (maybe with someone more experienced first time), and also ask for some advice for colleagues. They will definitely help you and say topics which you must pay attention to.

## Summary

These are all the basic skills that I develop in myself as a frontend engineer. Finally, I would like to say that all of the above should be developed along with direct professional skills - HTML, CSS, JS, accessibility, optimisation, etc - this is what an experienced Frontend developer should know, follow the news in their field and implement new practices in their lives.

### P.S Subscribe to my social networks 
- **GitHub**: <https://github.com/Algoritm211>
- **LinkedIn**: <https://www.linkedin.com/in/horbunov/>
- **Telegram Channel:** <https://t.me/world_of_frontend>
- **YouTube Channel:** <https://www.youtube.com/@alexey_horbunov>
