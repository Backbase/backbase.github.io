import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Author, AuthorsList } from '../model/author.model';
import { Observable, map, shareReplay } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthorsService {

  private cached: Observable<AuthorsList> = this.httpClient.get<AuthorsList>('authors.json').pipe(shareReplay());

  constructor(private httpClient: HttpClient) {}

  getAuthors(): Observable<AuthorsList> {
    return this.cached.pipe(
      map((authors) => Object.keys(authors).reduce((acc, curr) => ({
        ...acc,
        [curr]: {
          ...authors[curr],
          fullname: curr,
        }
      }), {})),
    );
  }

  getAuthorsDetails(postAuthors: Array<string | Author>): Observable<Author[] | undefined> {
    return this.getAuthors().pipe(map((authors) => postAuthors.map((author) => typeof author === 'string' ? authors[author] : author)));
  }
}
