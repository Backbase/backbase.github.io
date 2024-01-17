import { Component, Inject, Input } from '@angular/core';
import { Author } from '../../core/model/author.model';
import { NgClass, NgStyle } from '@angular/common';
import { AUTHORS_AVATAR_PATH_TOKEN } from '../../core/config/configuration-tokens';

@Component({
  selector: 'blog-author',
  standalone: true,
  imports: [NgStyle, NgClass],
  templateUrl: './author.component.html',
  styleUrl: './author.component.scss'
})
export class AuthorComponent {
  @Input('author') set _author(value: Author | string) {
    if (typeof value === 'string') {
      this.author = {
        fullname: value,
        avatar: '',
        role: ''
      }
    } else {
      this.author = value;
    }
  };
  @Input() size: string = 'sm';
  @Input() muted = false;

  author!: Author;

  get imagePath() {
    return `${this.basePath}/${this.size}/${this.author.avatar}`;
  }

  constructor(@Inject(AUTHORS_AVATAR_PATH_TOKEN) protected basePath: string) {}

}
