import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
  MatAutocompleteModule,
  MatAutocompleteSelectedEvent,
} from '@angular/material/autocomplete';
import { AsyncPipe } from '@angular/common';
import { debounceTime, filter, map, Observable, switchMap, tap } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { PostsService } from '../../core/services/posts.service';
import { Post } from '../../core/model/post.model';
import { Router } from '@angular/router';
import { getPermalink } from '@blog/utils';
import { HighlightDirective } from './highlight.directive';
import { ObservabilityService } from '../../core/services/observability.service';

@Component({
  selector: 'blog-search',
  standalone: true,
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    MatIconModule,
    AsyncPipe,
    HighlightDirective,
  ],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
})
export class SearchComponent implements OnInit {
  @Output() complete = new EventEmitter<void>();

  control = new FormControl<string>('');

  posts$ = this.postsService.getAllPosts();
  filteredOptions!: Observable<Post[]>;

  constructor(
    private postsService: PostsService,
    private router: Router,
    private observabilityService: ObservabilityService,
  ) {}

  ngOnInit() {
    this.filteredOptions = this.control.valueChanges.pipe(
      switchMap(() => {
        return this.postsService
          .getPosts(0, 5, false, this.filter.bind(this))
          .pipe(map(({ posts }) => posts || []));
      })
    );

    this.control.valueChanges.pipe(
      filter((search) => 
        typeof search === 'string' && search.length > 3),
      debounceTime(1000),
    ).subscribe((search) => {
      this.observabilityService.publishEvent({
        'search.term': <string>search,
      }, 'search');
    })
  }

  displayFn(post: Post): string {
    return post.title ?? '';
  }

  goToPost(event: MatAutocompleteSelectedEvent) {
    const post: Post = event.option.value;
    this.router.navigateByUrl(
      getPermalink(post.title, post.specialCategory, post.category, post.date)
    );
    this.control.setValue('');
    this.complete.emit();
  }

  private filter(post: Post) {
    const filters = [
      post.title.toLocaleLowerCase(),
      post.category.toLocaleLowerCase(),
      ...post.tags,
    ];
    if (this.control.value && this.control.value.length > 3) {
      const value = this.control?.value?.toLocaleLowerCase();
      return filters.some(element => element?.includes(value));
    } else {
      return false;
    }
  }
}
