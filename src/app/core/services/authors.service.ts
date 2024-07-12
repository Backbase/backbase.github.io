import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Author, AuthorsList } from '../model/author.model';
import { Observable, map, shareReplay } from 'rxjs';
import { AUTHORS_AVATAR_PATH_TOKEN } from '../config/configuration-tokens';
import { AssetsService } from './assets.service';
import { ImageSize } from '../model/content.model';
import { getAuthorPermalink } from '@blog/utils';

@Injectable({
  providedIn: 'root',
})
export class AuthorsService {
  private cached: Observable<AuthorsList> = this.httpClient
    .get<AuthorsList>('authors.json')
    .pipe(
      map(authors =>
        Object.keys(authors).reduce(
          (acc, curr) => ({
            ...acc,
            [curr]: {
              ...authors[curr],
              fullname: curr,
              url: `/people/${getAuthorPermalink(curr)}`,
              displayAvatar: this.generateAvatarPaths(authors[curr]?.avatar)
            },
          }),
          {}
        )
      ),
      shareReplay()
    );

  constructor(
    private httpClient: HttpClient,
    private assetsService: AssetsService,
    @Inject(AUTHORS_AVATAR_PATH_TOKEN) private basePath: string,
  ) {}

  getAuthors(): Observable<AuthorsList> {
    return this.cached;
  }

  getAuthorsDetails(
    postAuthors: Array<string | Author>
  ): Observable<Author[] | undefined> {
    return this.getAuthors().pipe(
      map(authors =>
        postAuthors.map(author =>
          typeof author === 'string' ? authors[author] : author
        )
      )
    );
  }

  private generateAvatarPaths(url?: string) {
    const sizes: ImageSize[] = ['sm', 'lg'];
    if (url) {
      return sizes.reduce((acc, curr) => ({
        ...acc,
        [curr]: `authors/${this.assetsService.getAssetPath(url, curr)}`
      }), {});
    }
    return undefined;
  }
}
