import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { AsyncPipe, DatePipe } from '@angular/common';
import {
  Observable,
  map,
} from 'rxjs';
import { PostContent } from '../../core/model/post.model';
import {
  ActivatedRoute,
  RouterLink,
  RouterModule,
} from '@angular/router';
import { MarkdownModule } from 'ngx-markdown';
import { AuthorComponent } from '../../components/author/author.component';
import { MatChipsModule } from '@angular/material/chips';
import { PostItemComponent } from '../../components/post-item/post-item.component';
import { DividerComponent } from '../../components/divider/divider.component';
import { Category } from '../../core/model/categories.model';
import { TableOfContentComponent } from '../../components/table-of-content/table-of-content.component';
import { PostUrlPipe } from '../../core/utils/post-url.pipe';
import { GradientComponent } from '../../components/gradient/gradient.component';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { HtmlInMarkdownService } from '../../core/services/html-in-markdown.service';
import { HeadersPipe } from '../../core/utils/headers.pipe';
import { RelatedPostsComponent } from '../related-posts/related-posts.component';

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
    HeadersPipe,
    RelatedPostsComponent,
  ],
  templateUrl: './post.component.html',
  styleUrl: './post.component.scss',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostComponent {
  post$: Observable<PostContent | undefined> =
    this.activatedRoute.data.pipe(map(({ post }) => post));

  Category = Object.fromEntries(Object.entries(Category));

  constructor(
    private activatedRoute: ActivatedRoute,
    private htmlInMarkdownService: HtmlInMarkdownService,
  ) {}

  resolveScripts() {
    this.htmlInMarkdownService.parseAll();
  }
}
