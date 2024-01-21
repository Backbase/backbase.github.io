import { Component, OnInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { AsyncPipe } from '@angular/common';
import { Observable, map, switchMap } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { PostsService } from '../../core/services/posts.service';
import { Post } from '../../core/model/post.model';
import { Router } from '@angular/router';
import { getPermalink } from '@blog/utils';

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
  ],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
})
export class SearchComponent implements OnInit {
  control = new FormControl<string>('');

  posts$ = this.postsService.getAllPosts();
  filteredOptions!: Observable<Post[]>;
  
  constructor(private postsService: PostsService, private router: Router) {}

  ngOnInit() {
    this.filteredOptions = this.control.valueChanges.pipe(
      switchMap(() => {
        return this.postsService.getPosts(0, 5, false, this.filter.bind(this)).pipe(map(({ posts }) => posts || []))
      })
    );
  }

  displayFn(post: Post): string {
    return post.title ?? '';
  }

  goToPost(event: MatAutocompleteSelectedEvent) {
    const post: Post = event.option.value;
    this.router.navigateByUrl(getPermalink(post.title, post.date, post.category));
    this.control.setValue('');
  }

  private filter(post: Post) {
    if (this.control.value && this.control.value.length > 3) {
      return post.title.toLocaleLowerCase().includes(this.control.value.toLocaleLowerCase())
    } else {
      return false;
    }
  }
}
