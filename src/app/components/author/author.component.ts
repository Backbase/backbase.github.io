import { Component, Input } from '@angular/core';
import { Author } from '../../core/model/author.model';
import { NgClass, NgStyle } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ImageSize } from '../../core/model/content.model';
import { AvatarComponent } from '../avatar/avatar.component';

@Component({
  selector: 'blog-author',
  standalone: true,
  imports: [NgStyle, NgClass, RouterLink, AvatarComponent],
  templateUrl: './author.component.html',
  styleUrl: './author.component.scss',
})
export class AuthorComponent {
  @Input('author') set _author(value: Author | string) {
    if (typeof value === 'string') {
      this.author = {
        fullname: value,
        avatar: '',
        role: '',
        url: '',
      };
    } else {
      this.author = value;
    }
  }
  @Input() size: ImageSize = 'sm';
  @Input() muted = false;

  author!: Author;
}
