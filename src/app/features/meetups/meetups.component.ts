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
import { map, switchMap } from 'rxjs';


@Component({
  selector: 'blog-meetups',
  standalone: true,
  imports: [
    DividerComponent,
    GradientComponent,
    PostsListComponent,
    AsyncPipe,
    MeetupsHeaderComponent,
    MatPaginator,
  ],
  providers: [NavigationService],
  templateUrl: './meetups.component.html',
  styleUrl: './meetups.component.scss',
})
export class MeetupsComponent {
  currentPage$ = this.navigationService.currentPage$;
  newestMeetup$ = this.findNewestMeetup$();
  allMeetups$ = this.getAllMeetups$();

  constructor(
    private postsService: PostsService,
    private navigationService: NavigationService
  ) {}

  navigate(page: PageEvent) {
    this.navigationService.navigate(page.pageIndex);
  }

  private findNewestMeetup$() {
    return this.postsService.getPosts(
      undefined,
      undefined,
      false,
      post => this.isMeetupCategory(post),
      (a, b) => this.compareByDate(a, b)
    ).pipe(map(result => result.posts[0]));
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
