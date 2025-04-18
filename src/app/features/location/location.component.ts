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
import { JobsComponent } from '../../components/jobs/jobs.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute } from '@angular/router';
import { NotFoundComponent } from '../not-found/not-found.component';
import { TransitionComponent } from '../../components/transition/transition.component';
import { LocationsTabComponent } from '../../core/layout/locations-tab/locations-tab.component';
import { MeetupFooterComponent } from '../../components/meetup-footer/meetup-footer.component';
import { MeetupsHeaderComponent } from '../../components/meetups-header/meetups-header.component';
import { Category } from '../../core/model/categories.model';

@Component({
  selector: 'blog-location',
  standalone: true,
  imports: [
    CommonModule,
    LocationsTabComponent,
    PostsListComponent,
    MatPaginatorModule,
    DividerComponent,
    MeetupFooterComponent,
    JobsComponent,
    MatProgressSpinnerModule,
    NotFoundComponent,
    TransitionComponent,
    MeetupsHeaderComponent,
  ],
  templateUrl: './location.component.html',
  styleUrl: './location.component.scss',
  providers: [NavigationService],
})
export class LocationComponent {
  location$ = this.activatedRoute.paramMap.pipe(
    map(params => params.get('loc'))
  );

  currentPage$ = this.navigationService.currentPage$;
  posts$: Observable<Posts> = combineLatest([
    this.currentPage$,
    this.location$,
  ]).pipe(
    switchMap(([page, location]) =>
      this.postsService.getPosts(
        page,
        undefined,
        false,
        (post: Post) => post.location === location,
        (a, b) => this.compareByDate(a, b)
      )
    ),
  );
  newestMeetup$ = this.findNewestMeetup$();
  authors$: Observable<AuthorsList> = this.authorsService.getAuthors();
  locations$: Observable<string[]> = this.postsService.getLocations();

  constructor(
    private postsService: PostsService,
    private authorsService: AuthorsService,
    private navigationService: NavigationService,
    private activatedRoute: ActivatedRoute
  ) {}

  navigate(page: PageEvent) {
    this.navigationService.navigate(page.pageIndex);
  }

  private findNewestMeetup$() {
    return combineLatest([
      this.currentPage$,
      this.location$,
    ]).pipe(
      switchMap(([_, loc]) => 
        this.postsService.getPosts(
          undefined,
          undefined,
          false,
          post => this.isMeetupCategoryByLocation(post, loc),
          (a, b) => this.compareByDate(a, b)
        ).pipe(
          map(result => {
            const startOfToday = new Date();
            startOfToday.setHours(0, 0, 0, 0);

            return this.postsService.findSoonestPostAfter(result.posts, startOfToday.getTime());
          })
        )
      )
    );
  }

  private isMeetupCategoryByLocation(post: Post, location: string | null): boolean {
    return post.category === Category.meetups && post.location === location;
  }

  private compareByDate(a: Post, b: Post): number {
    return (
      new Date(b.date?.trim() ?? 0).getTime() -
      new Date(a.date?.trim() ?? 0).getTime()
    );
  }
}
