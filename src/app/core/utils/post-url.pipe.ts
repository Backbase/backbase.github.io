import { Inject, Pipe, PipeTransform } from '@angular/core';
import { Post } from '../model/post.model';
import { getPermalink } from '@blog/utils';
import { STANDALONE_CATEGORIES_TOKEN } from '../config/configuration-tokens';

@Pipe({
  name: 'postUrl',
  standalone: true
})
export class PostUrlPipe implements PipeTransform {

  constructor(@Inject(STANDALONE_CATEGORIES_TOKEN) private standaloneCategories: string[]) {}

  transform(post: Post, content?: string): string {
    const postUrl = getPermalink(post.title, post.date ? new Date(post.date) : undefined, post.category, this.standaloneCategories.includes(post.category));
    
    if (content) {
      return `${postUrl}/${content}`;
    }
  return postUrl;
  }
}
