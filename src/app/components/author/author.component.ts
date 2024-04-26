import { Component, Input } from '@angular/core';
import { Author } from '../../core/model/author.model';
import { NgClass, NgStyle } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AssetsService } from '../../core/services/assets.service';

@Component({
  selector: 'blog-author',
  standalone: true,
  imports: [NgStyle, NgClass, RouterLink],
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
  @Input() size: string = 'sm';
  @Input() muted = false;

  author!: Author;

  get imagePath() {
    return `${this.assetsService.getBase(this.size, 'authors')}/${this.author.avatar}`;
  }

  constructor(
    private assetsService: AssetsService,
  ) {}
}
