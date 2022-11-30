---
title: "Sprint Demo:Best Practises"
excerpt: "How to conduct a Perfect Sprint Review(Demo)"
tags: Sprint Demo
authors:
- Venkata Gopu
header:
  teaser: /assets/images/post/sprintdemo.jpeg
  teaser_alt: Fragments
category: Software Quality Assurance
---

## **how do you give a good demo?**


Here are a few tips:.

{% include
  components/figure.html
  url="/assets/images/post/SprintReview.jpeg"
  description="Sprint Review"
%}


Fragments are reusable containers within our app allowing us to present the same user interface layout in a variety of activities and layout configurations. Given the versatility of fragments, it's important to validate that they provide a consistent and resource-efficient experience.

Note the following:
* Your fragment shouldn't be dependent on a specific parent activity or another fragment.
* You shouldn't create a fragment's view hierarchy unless the fragment is visible to the user.

To perform Fragments testing we have such helper as AndroidX "fragment-testing" library, which provides the "FragmentScenario" class to create Fragments and change their `Lifecycle.State`. We are able to launch the screen we want to test and skip the rest.


## **Let's Start**

Focus on acceptance criteria. You’ve defined what done means for the story (right?), so focus your demo around proving that you’re actually done.

Start with the demo in mind. Don’t wait to think about the demo until you’re done with the story. You might be able to write tests that double as demo scripts. And it’s best to plan your demo for a story while it’s fresh in your mind, before you move to the next story.

Prepare. Don’t ad lib. Think through an interesting scenario to prove that you’ve satisfied the core acceptance criteria. Create any necessary test data. Use tools like Watir if necessary to get your app into a state where you can start an interesting demo.

Practice. Run through the demo at least once. When you’re getting started, you might want to grab a trial version of Camtasia and record yourself giving the practice demo. Painful, huh? That just means you need to work on it.

Tell a story. Center your demo around a realistic user solving a real problem. The point is not just to show that the software works, but to show that it’s valuable.

Keep it short. If you work on your stories one at a time and get them accepted when they’re ready, you don’t need to exhaustively cover all your acceptance criteria in your demo. Instead, focus your demo on what’s interesting and what’s valuable about each feature.

The sprint demo should be the most exciting part of Scrum. It’s when the team gets to show everyone all the value they’re delivering. That’s worth investing a little time to do well. You may find that previously disinterested stakeholders start coming just for the show.
