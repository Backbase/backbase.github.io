import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostsListComponent } from '../../components/posts-list/posts-list.component';
import { NavigationService } from '../../core/services/navigation.service';
import { Observable, combineLatest, map, switchMap } from 'rxjs';
import { Post, Posts } from '../../core/model/post.model';
import { AuthorsList } from '../../core/model/author.model';
import { PostsService } from '../../core/services/posts.service';
import { AuthorsService } from '../../core/services/authors.service';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { DividerComponent } from '../../components/divider/divider.component';
import { EngineeringContentComponent } from '../../components/engineering-content/engineering-content.component';
import { JobsComponent } from '../../components/jobs/jobs.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute } from '@angular/router';
import { CategoryTitleComponent } from '../../components/category-title/category-title.component';
import { CategoriesTabComponent } from '../../core/layout/categories-tab/categories-tab.component';

@Component({
  selector: 'blog-category',
  standalone: true,
  imports: [
    CommonModule,
    CategoriesTabComponent,
    PostsListComponent,
    MatPaginatorModule,
    DividerComponent,
    EngineeringContentComponent,
    JobsComponent,
    MatProgressSpinnerModule,
    CategoryTitleComponent,
  ],
  templateUrl: './category.component.html',
  styleUrl: './category.component.scss',
  providers: [NavigationService]
})
export class CategoryComponent {
  category$ = this.activatedRoute.paramMap.pipe(map(params => params.get('cat')));

  currentPage$ = this.navigationService.currentPage$;
  posts$: Observable<Posts> = combineLatest([this.currentPage$, this.category$])
    .pipe(switchMap(([page, category]) => this.postsService.getPosts(
      page, undefined, false, (post: Post) => post.category === category,
    )));
  authors$: Observable<AuthorsList> = this.authorsService.getAuthors();
  categories$: Observable<string[]> = this.postsService.getCategories();

  constructor(
    private postsService: PostsService,
    private authorsService: AuthorsService,
    private navigationService: NavigationService,
    private activatedRoute: ActivatedRoute,
  ) {}

  navigate(page: PageEvent) {
    this.navigationService.navigate(page.pageIndex);
  }
}
