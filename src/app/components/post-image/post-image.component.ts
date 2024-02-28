import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'blog-post-image',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './post-image.component.html',
  styleUrl: './post-image.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostImageComponent {
  images = [
    { url: 'md', width: 800 },
    { url: 'lg', width: 1200 },
  ];

  @Input() set url(value: string) {
    const splittedHref = value.split('/');
    const lastItem = splittedHref.pop();
    this.images.forEach(element => {
      element.url = [...splittedHref, 'dist', element.url, lastItem].join('/');
    });
  }
}
