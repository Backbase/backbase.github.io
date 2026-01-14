import {
  ChangeDetectionStrategy,
  Component,
  Input,
  ViewEncapsulation,
} from '@angular/core';
import { DatePipe } from '@angular/common';
import { PostContent } from '../../core/model/post.model';
import { RouterLink, RouterModule } from '@angular/router';
import { MarkdownModule } from 'ngx-markdown';
import { AuthorComponent } from '../../components/author/author.component';
import { MatChipsModule } from '@angular/material/chips';
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
  imports: [
    DatePipe,
    MarkdownModule,
    AuthorComponent,
    MatChipsModule,
    RouterModule,
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
  /**
   * From route data
   */
  @Input() post!: PostContent;

  Category = Object.fromEntries(Object.entries(Category));

  constructor(private htmlInMarkdownService: HtmlInMarkdownService) {}

  resolveScripts() {
    this.htmlInMarkdownService.parseAll();
  }
}
