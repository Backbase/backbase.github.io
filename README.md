# [Backbase Engineering Blog](https://engineering.backbase.com)

This blog is an Angular single page application, which builds a static web site based on content created using markdown.

## Build locally

### Prerequisites

- NodeJS 20+
- NPM 10+

> If you have `nvm` installed, just run `nvm use`

### Installation 

Run the followig commands to install and run the application:

```bash
  $ npm ci
  $ npm run build:utils
  $ npm start
```

## Creating content

To create a new post, run the following command to scaffold the structure:

```bash
  $ npm run posts:new
```

This will prompt some questions to prefill the data of your post – don't worry, you can edit it later.

Once scaffolded, you can edit your post in `content/posts/unpublished/{title}`

> Be aware:
> - Date will be set at the moment you merge your PR, so keep it unpublished
> - Changes to the post metadata – header of markdown – requires a rebuild: `npm run posts:update` or server restart (`npm start`)

For guidelines on writing your post, please check the [next section](#content)

---

The blog is served at http://localhost:4200

## Publishing an article

* Ensure you're part of the list of authors in [content/authors/authors.json](content/authors/authors.json). Add your profile image to folder [content/authors/avatars/](content/authors/avatars/);
* Commit your changes to a new branch created out of `main`;
* Check the result of your newly created post [running it locally](#build-locally);
* Create a PR against `main` branch and request the necessary reviews.

## Content

Welcome to our official technology blog. The idea is to share with the Community about our technology challenges. A blog post in an engineering blog should show readers what in-house engineering teams are actually working on. Engineering posts help peers understand what a particular individual or team within a much larger organization actually works on, keeping sales and marketing to an absolute minimum. These posts tell us about an engineering team’s philosophy as well as their stack.

They should be educational. Well-written blog posts offer unique perspectives and different solutions to old problems. They help the reader learn about a specific topic and technology, and walk readers through how that topic/technology is applied to help the team work through a challenge. Readers should learn something new. 

Regardless of the topic, the first question to ask yourself is, "Why should a reader care?" Readers don't just want to look at a blog post and say, "Cool, Company X did this thing...." and that's it. At the very least, they want to understand:

- Why was this approach taken?  
- What went into deciding on that approach?  
- What is this [topic/software/etc] that was chosen and why?  
- What lessons came out of it? 
 
Engineering blog posts are not just about "show and tell"; they're how our engineering teams shares knowledge with peers across the wider tech community. And engineering blog posts provide value to the engineers writing them; they increase an engineer's profile and they give the engineer the chance to share what they've worked on. Also, they're a great way of attracting new candidates ;-)

Do you have an interesting topic to share but it's not technical? we have a place for that too, please check: https://medium.com/backbase

## Linting your posts

We use Google Style Guide and write-good to provide consistent writing style.

The linting tool is [Vale](https://github.com/errata-ai/vale) and you can run it locally by following the [installation](https://vale.sh/docs/vale-cli/installation/) and running the following command.


```bash
$ vale --glob='*.md' --minAlertLevel=warning .
```

For more information, check the [usage docs](https://docs.errata.ai/vale/cli)
