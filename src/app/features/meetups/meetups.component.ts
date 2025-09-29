import { Component } from '@angular/core';
import { DividerComponent } from '../../components/divider/divider.component';
import { GradientComponent } from '../../components/gradient/gradient.component';
import { PostsService } from '../../core/services/posts.service';
import { Post } from '../../core/model/post.model';
import { PostsListComponent } from '../../components/posts-list/posts-list.component';
import { AsyncPipe } from '@angular/common';
import { MeetupsHeaderComponent } from '../../components/meetups-header/meetups-header.component';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { NavigationService } from '../../core/services/navigation.service';
import { map, Observable, switchMap } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { LocationsComponent } from '../../components/locations/locations.component';
import { Location } from '../../core/model/locations.model';
import { MeetupFooterComponent } from '../../components/meetup-footer/meetup-footer.component';


@Component({
    selector: 'blog-meetups',
    imports: [
        GradientComponent,
        PostsListComponent,
        AsyncPipe,
        MeetupsHeaderComponent,
        LocationsComponent,
        DividerComponent,
        MeetupFooterComponent,
        MatPaginator,
    ],
    providers: [NavigationService],
    templateUrl: './meetups.component.html',
    styleUrl: './meetups.component.scss'
})
export class MeetupsComponent {
  locations$: Observable<Location[]> = this.postsService
    .getLocations();
  
  selectedCategory$ = this.activatedRoute.paramMap.pipe(
    map(params => params.get('loc') as Location)
  );
  currentPage$ = this.navigationService.currentPage$;
  newestMeetup$ = this.findNewestMeetup$();
  allMeetups$ = this.getAllMeetups$();

  constructor(
    private postsService: PostsService,
    private navigationService: NavigationService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
  ) {}

  navigate(page: PageEvent) {
    this.navigationService.navigate(page.pageIndex);
  }

  navigateToLocation(selected: string | string[]) {
    this.router.navigate(['meetup', selected]);
  }

  private findNewestMeetup$() {
    return this.postsService
      .getPosts(
        undefined,
        undefined,
        false,
        post => this.isMeetupCategory(post),
        (a, b) => this.compareByDate(a, b)
      )
      .pipe(map(result => {
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);

        return this.findSoonestAfter(result.posts, startOfToday.getTime());
      }));
  }

  findSoonestAfter(posts: Post[], minValue: number): Post | null {
    let soonest: Post | null = null;
  
    for (const post of posts) {
      const num = new Date(post.date?.trim() ?? '').getTime();
      if (num > minValue && (soonest === null || num < new Date(soonest.date?.trim() ?? '').getTime())) {
        soonest = post;
      }
    }
  
    return soonest;
  }

  private getAllMeetups$() {
    return this.currentPage$.pipe(
      switchMap(page =>
        this.postsService.getPosts(
          page,
          undefined,
          false,
          post => this.isMeetupCategory(post),
          (a, b) => this.compareByDate(a, b)
        )
      )
    );
  }

  private compareByDate(a: Post, b: Post): number {
    return (
      new Date(b.date?.trim() ?? 0).getTime() -
      new Date(a.date?.trim() ?? 0).getTime()
    );
  }

  private isMeetupCategory(post: Post): boolean {
    return (post.category as string) === 'meetups';
  }
}
