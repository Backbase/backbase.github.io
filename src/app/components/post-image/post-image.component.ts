import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ProcessedAsset } from '../../core/model/content.model';

@Component({
    selector: 'blog-post-image',
    imports: [CommonModule],
    templateUrl: './post-image.component.html',
    styleUrl: './post-image.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PostImageComponent {
  @Input() asset!: ProcessedAsset;
  @Input() postUrl!: string;
}
