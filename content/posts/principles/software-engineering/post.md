# Software Engineering

Our engineering principles

![](assets/software-engineering.png)

Authors: Craig Walker, Marco Santarelli
Date: 
Category: principles

tags: software engineering

---

## A short introduction
### What are these principles and why we need them?

Backbase people are craftspeople: we understand the importance of quality and we believe in great design. As an engineer, think of when you are happy with the standard of your work. What makes you feel proud of your deliverable? What makes your designs not just good but great? Finding a shared definition that encapsulates these answers might seem impossible, but that hasn’t stopped us from trying.

What you will find following this introduction are our shared engineering principles. If applied and followed correctly, these principles aim to ensure our solutions are driven by sound reasoning and measurable outcomes, and lead to compelling and future-proof technical designs. If our software products were a car, adopting these principles should create a shiny Formula 1 racer with a powerful engine, not a leaking, secondhand rust bucket that breaks down.

Engineering principles outline the ideas, rules, and concepts to keep in mind when solving an engineering problem at Backbase. If when reading through them you think some are foregone, self-evident, or just plain common sense, that‘s a good sign - that means we nailed it. Even if you feel you already know them, there is value in having shared principles we all refer to and validate our ideas against. 

There are usually a lot of things to think about when starting a new design or improving an existing one. It’s up to you to choose what is most important or applicable, but try to do the mental exercise of going through each principle and reflecting openly on whether you’re operating in accordance with it. Do this not only when you are in doubt about how to proceed, but especially when you are sure.

## ONE - Ship it and iterate

We think big, but start small. Don’t try to encompass all present and future requirements in your solution, or create sterile abstractions away from the dynamics of the real world.
No matter how perfect a design might seem, the only way to know whether it works is to get it in the hands of users and see what they do with it. Resist the urge to add “one more” feature and let users show you what to focus on next. 

**Make changes small, make them often**.
    
Being able to deliver continuous incremental changes is more important than nailing that perfect implementation on the first try: sorry to be the ones to break it to you, but that’s never going to happen, no matter how good you are!

----------

## TWO - Y.A.G.N.I.
### You ain’t gonna need it

Don't write code to solve problems you don't have yet. The future use cases you envision now inevitably change, or  work a little differently than you imagined. You don’t want to find yourself rewriting code you’ve only just written.

**Keep it simple**. Simple requirements and functionality need simple solutions that enable you to add complexity later. Design for the simple case first and aim for as little configuration or parameterization as possible. Only add options or additional API methods as they are needed for more complicated or flexible use cases.

This applies to NFRs and code refactorings too: the conscious, careful accumulation of technical debt can be a powerful tool that lets us ship what we’re building faster. Don’t be afraid of it, but be deliberate about it. Just like with financial debt, we know that we need to repay it over time to avoid the interest on the debt becoming unbearable.


----------

## THREE - Solve real problems at the root

Before designing a solution to a problem, ask yourself if you have a deep understanding of the issue you are trying to solve. If you have never experienced the problem yourself, you probably don’t. 
Get the right input. Without a full grasp of the issue’s scope, you’re not in a position to decide on the best solution. Involve people with different knowledge and experience. Work with people across different disciplines. Talk to users and stakeholders.

Having a clear, collective understanding of how our code works across all areas is fundamental to building high-quality systems that don’t break, and that remain as easy to change in ten years as they are today. While quick fixes and hacks are necessary and useful, understand what a “full” solution looks like.

The best way to know if you’ve done this right is by trying to drink your own Champagne: use the product you built, use your own libraries and accelerators, and conduct customer and peer empathy sessions. 

------------

## FOUR - With (not so) great code comes great responsibility
### (aka Not Invented Here™)

Code is the enemy: **it can go wrong, and it needs maintenance**. Write less code. Delete code.  **Don’t write code you don’t need**. Whenever possible, consider using a well-groomed open source library that can do the job instead of writing one yourself: someone else has probably already solved the problem for you. **Don’t reinvent the wheel**. Look out there and ask questions before you reach for your toolbox.

Only resort to building your own libraries if the following reasons mean existing solutions won’t work:

 -  There are doubts on support or maturity.
 -  The licensing, features, or architecture are inadequate.
 -  Attempts to contribute to the open source community or build on top of existing libraries have failed.

 ------------

## FIVE - Before you make it beautiful and fast...
### Make It Work 

Fact or fiction? NASA spent millions to develop a pen that would write in zero-G, whereas the soviet cosmonauts simply used a pencil. This is a good factoid to keep in mind when you go about designing and optimizing your code. It’s important to speed up your program, reduce the consumption of system resources, or make the feature you’re implementing more powerful and generic, but everything has its time: avoid premature optimization and overengineering.

Optimization carried out in the early stages of development can do more harm than good. This is primarily because the development of optimized code requires more time and effort, and leads to more complexity. At first, it’s more profitable to use the simplest approach (the pencil) rather than the optimal one (the space-faring pen). Assessing how much the approach slows down the work of your application, or moving to a less resource-intensive algorithm, is pointless if you’re not certain that the solution is the right one. As we saw earlier in “Ship it and iterate”, if the requirements change while you’re busy figuring out the perfect solution, your highly optimized code will end up in the garbage before it’s even used.

Pro tip: Automated integration tests are the ideal way to make sure you stay on the right track as you work on improving your solution.

------------

## SIX - A good engineer loves numbers

...but how to make it fast when you need to? Telemetry and profiling are the only sure ways to find where the bottlenecks are: intuition is often misleading and the bottleneck might not be quite where you thought it was. If you can’t show it’s a bottleneck, don’t optimize it. Writing a test that exercises the code you’re profiling with timing around it makes it easier to know when you’re done, and can be left in the test suite to prevent performance regressions.

Well-behaved engineers measure things before they make any decisions. You cannot make an informed decision without objective data points and comparable KPIs for competing solutions and implementations.

This doesn’t only apply to the measures related to performance or scalability issues , but to every aspect of our day-to-day decision making. The value of a software feature in our product is directly connected to the percentage of the user base that adopts it. The better solution might not look as good if the cost to implement it turns out to be orders of magnitude higher than the competing ones.  

**Be user-driven and data-informed.**

------------

## SEVEN - Write code for 
### your future-self (and others)

Write code to be read. The best code can distill complex ideas into something concise and easy-to-follow. When you review pull requests from your peers, remember: if code is hard to understand, it’s probably too complex – and complex code is a breeding ground for insidious bugs. Write code to be debugged. Software has bugs - that’s normal. You can help yourself and your peers by thinking about how you might debug software from the get-go: don’t swallow errors silently, and use telemetry and logging liberally. Use comments to explain the why and not the what.

Review your own code: if you spot things that shouldn’t be there, remove them immediately. Don’t wait for someone else to tell you to do it.

Test your code: don’t rely exclusively on someone else to write and run tests for you. Leave the codebase better than you found it. Any engineer can propose a change to any part of our codebase, and you’re never stepping on anyone’s toes by trying to make things better.

Software development is not over just after the code is written. People have to maintain it as well. Think about the “-ilities”, like Observability, Upgradability, Operability, and Scalability. You are in it for the long run. We are all responsible for writing good code. 

------------

## EIGHT - Security starts with you
### (This message will self-destruct in…)

We like to joke that there are only two types of companies in the world: those that have been hacked and those that will be don’t know they have been hacked. Here at Backbase we build a software product used by banks, one of the most targeted industries when it comes to security breaches. The attitude of “it’s just another project” won’t fly if we want to avoid being tomorrow’s headline.
Prefer standard security frameworks and libraries. Resist building out your own.

Software is not like wine, it doesn’t age well. Exploits based on known security vulnerabilities are often the easiest way for a malicious user to gain access to your system. Upgrade your libraries regularly, patch often, and correct vulnerabilities ASAP. Automated static code analysis is a powerful tool that can help with this.

Don’t develop security features if there is an infrastructural solution that can do the job.
When reviewing PRs and code, pay extra attention to security. Always attempt to identify potential threats, such as structural vulnerabilities or the absence of appropriate safeguards.

------------

<!-- vale off -->
Here, you make it happen!
<!-- vale on -->
