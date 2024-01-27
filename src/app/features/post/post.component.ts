import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  ViewEncapsulation,
  signal,
} from '@angular/core';
import { AsyncPipe, DOCUMENT, DatePipe } from '@angular/common';
import { Observable, catchError, filter, finalize, map, switchMap, tap, throwError, withLatestFrom } from 'rxjs';
import { Post } from '../../core/model/post.model';
import { PostsService } from '../../core/services/posts.service';
import {
  ActivatedRoute,
  Router,
  RouterLink,
  RouterModule,
} from '@angular/router';
import { MarkdownModule, MarkdownService } from 'ngx-markdown';
import { AuthorComponent } from '../../components/author/author.component';
import { MatChipsModule } from '@angular/material/chips';
import { PostItemComponent } from '../../components/post-item/post-item.component';
import { DividerComponent } from '../../components/divider/divider.component';
import { Category } from '../../core/model/categories.model';
import { TableOfContentComponent } from '../../components/table-of-content/table-of-content.component';
import { HeaderNode } from '../../core/model/content.model';
import { PostUrlPipe } from '../../core/utils/post-url.pipe';
import { GradientComponent } from '../../components/gradient/gradient.component';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { NotFoundComponent } from '../not-found/not-found.component';

@Component({
  selector: 'blog-post',
  standalone: true,
  imports: [
    AsyncPipe,
    DatePipe,
    MarkdownModule,
    AuthorComponent,
    MatChipsModule,
    RouterModule,
    DividerComponent,
    PostItemComponent,
    MarkdownModule,
    TableOfContentComponent,
    PostUrlPipe,
    GradientComponent,
    RouterLink,
    MatButtonModule,
    MatSidenavModule,
    NotFoundComponent,
  ],
  templateUrl: './post.component.html',
  styleUrl: './post.component.scss',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostComponent {
  post$: Observable<Post | undefined> = this.activatedRoute.url.pipe(
    map(segments => segments.map(({ path }) => path).join('/')),
    switchMap(permalink => this.postsService.getPost(permalink)),
    tap((post) => {
      if (post) return;
      this.notFound = true;
    }),
  );

  markdown$: Observable<string> = this.activatedRoute.url.pipe(
    map(segments => `${segments.map(({ path }) => path).join('/')}/post.md`),
    switchMap(link => this.markdownService.getSource(link)),
    map(this.removeMarkdownMetadataHeader),
  );

  relatedPosts$: Observable<Post[]> = this.post$.pipe(
    filter(Boolean),
    switchMap(post =>
      this.postsService.getPosts(
        0,
        2,
        false,
        (_post: Post) =>
          post.title !== _post.title &&
          (post.category === _post.category ||
            post.tags.some(tag => _post.tags.includes(tag)))
      )
    ),
    map(({ posts }) => posts)
  );

  Category = Object.fromEntries(Object.entries(Category));

  headers$: Observable<HeaderNode[]> = this.markdown$.pipe(
    withLatestFrom(this.post$),
    map(([markdown, post]) => this.createTree(markdown, post?.title))
  );

  notFound = false;

  constructor(
    private postsService: PostsService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private markdownService: MarkdownService,
    @Inject(DOCUMENT) private document: Document,
    private cd: ChangeDetectorRef
  ) {
    this.markdownService.getSource;
  }

  navigate(path: string) {
    this.router.navigate([path]);
  }

  private createTree(markdown: string, rootTitle: string = '') {
    const regExp = new RegExp(/<h\d(.*?)<\/h\d>/gm);
    const matches = this.markdownService
      .parse(markdown)
      .toString()
      .match(regExp);

    const nodes: Element[] =
      matches?.map(raw => {
        const node = this.document.createElement('div');
        node.innerHTML = raw;
        return node.firstElementChild as Element;
      }) ?? [];

    const headings = nodes.map(node => ({
      id: node.getAttribute('id') as string,
      heading: node.textContent as string,
      level: Number(node.tagName.replace(/\D/g, '')),
      children: [],
    }));

    return headings
      .reduce(
        (hierarchy: HeaderNode[], node: HeaderNode) => {
          while (hierarchy[hierarchy.length - 1].level >= node.level) {
            hierarchy.pop();
          }
          hierarchy[hierarchy.length - 1].children.push(node);
          hierarchy.push(node);

          return hierarchy;
        },
        [{ id: 'post-header', heading: rootTitle, level: 1, children: [] }]
      )
      .splice(0, 1);
  }

  private removeMarkdownMetadataHeader(markdown: string) {
    try {
      return markdown.split(/---(.+)/s)[1];
    } catch (e) {
      throw new Error('Markdown not with right format');
    }
  }
}
