# [Backbase Engineering Blog](https://engineering.backbase.com)

Static blog powered by [Jekyll](https://jekyllrb.com/)

## Build locally

```sh
bundle install
bundle exec jekyll serve
```

## Content

Welcome to our official technology blog. The idea is to share with the Community about our technology challenges. A blog post in an engineering blog should show readers what in-house engineering teams are actually working on. Engineering posts help peers understand what a particular individual or team within a much larger organization actually works on, keeping sales and marketing to an absolute minimum. These posts tell us about an engineering team’s philosophy as well as their stack.  
But they're be educational. Well-written blog posts offer unique perspectives and different solutions to old problems. They help the reader learn about a specific topic and technology, and walk readers through how that topic/technology is applied to help the team work through a challenge. Readers should learn something new. 

Regardless of the topic, the first question to ask yourself is, "Why should a reader care?" Readers don't just want to look at a blog post and say, "Cool, Company X did this thing...." and that's it. At the very least, they want to understand:

- Why was this approach taken?  
- What went into deciding on that approach?  
- What is this [topic/software/etc] that was chosen and why?  
- What lessons came out of it? 
 
Engineering blog posts are not just about "show and tell"; they're how our engineering teams shares knowledge with peers across the wider tech community. And engineering blog posts provide value to the engineers writing them; they increase an engineer's profile and they give the engineer the chance to share what they've worked on. Also, they're a great way of attracting new candidates ;-)

Do you have an interesting topic to share but it's not technical? we have a place for that too, please check: https://medium.com/backbase


## Publishing an article

* Branch out of `main` branch.
* Ensure you're part of the list of authors in [_data/authors.yml](_data/authors.yml). Add your profile image to folder [assets/images/avatars/](assets/images/avatars/).
* Create a file inside folder [_posts/](_posts/) with the following naming convention: `yyyy-mm-dd-title-with-spaces.md`
* Add images that you'll use in this post to folder [assets/images/post/](assets/images/post/)
* Ensure your header is correct. Use existing posts as an example, both for the header and the content.
* Ensure you run `bundle install && bundle exec jekyll serve` locally and double check everything is fine at http://127.0.0.1:4000/ before submitting a PR to branch `main`.

## Linting your posts

We use Google Style Guide and write-good to provide consistent writing style.

The linting tool is [Vale](https://github.com/errata-ai/vale) and you can run it locally by following the [installation](https://docs.errata.ai/vale/install) and running the following command.


```bash
vale --glob='*.md' --minAlertLevel=warning .
```

For more information, check the [usage docs](https://docs.errata.ai/vale/cli)
