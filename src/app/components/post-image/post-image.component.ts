import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, Input } from '@angular/core';
import { AssetsService } from '../../core/services/assets.service';

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
    this.images.forEach(element => {
      element.url = value.replace('assets', this.assetsService.getBase(element.size, 'assets'));
    });
  }

  constructor(private assetsService: AssetsService) {}
}
