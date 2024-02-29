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
    { size: 'md', width: 800, url: '' },
    { size: 'lg', width: 1200, url: '' },
  ];

  isShown = true;

  @Input() set url(value: string) {
    this.isShown = !!value;
    if (!this.isShown) {
      return;
    }
    const splittedHref = value.split('/');
    const lastItem = splittedHref.pop();
    this.images.forEach(element => {
      element.url = [...splittedHref, 'dist', element.size, lastItem].join('/');
    });
  }
}
