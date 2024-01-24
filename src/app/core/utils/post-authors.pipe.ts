import { Pipe, PipeTransform } from '@angular/core';
import { Author, AuthorsList } from '../model/author.model';

@Pipe({
  name: 'postAuthors',
  standalone: true,
})
export class PostAuthorsPipe implements PipeTransform {
  transform(authors: AuthorsList | undefined, postAuthors: string[]): Author[] {
    if (!authors) {
      return [];
    }
    return postAuthors.map(authorName => authors[authorName]);
  }
}
