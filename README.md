# [Backbase Engineering Blog](https://engineering.backbase.com)

Static blog powered by [Jekyll](https://jekyllrb.com/)

## Build locally

```sh
bundle install
bundle exec jekyll serve
```

## Publishing an article

* Branch out of `main` branch.
* Ensure you're part of the list of authors in [_data/authors.yml](_data/authors.yml). Add your profile image to folder [assets/images/avatars/](assets/images/avatars/).
* Create a file inside folder [_posts/](_posts/) with the following naming convention: `yyyy-mm-dd-title-with-spaces.md`
* Add images that you'll use in this post to folder [assets/images/post/](assets/images/post/)
* Ensure your header is correct. Use existing posts as an example, both for the header and the content.
* Ensure you run `bundle install && bundle exec jekyll serve` locally and double check everything is fine at http://127.0.0.1:4000/ before submitting a PR to branch `main`.
