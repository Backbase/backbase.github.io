import { Pipe, PipeTransform } from '@angular/core';
import { Post } from '../model/post.model';
import { getPermalink } from '@blog/utils';

@Pipe({
  name: 'postUrl',
  standalone: true
})
export class PostUrlPipe implements PipeTransform {
  transform(post: Post, content?: string): string {
    const postUrl = getPermalink(post.title, post.date, post.category);
    
    if (content) {
      return `${postUrl}/${content}`;
    }
  return postUrl;
  }
}
