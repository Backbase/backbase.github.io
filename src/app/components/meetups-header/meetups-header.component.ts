import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { Post } from '../../core/model/post.model';
import { MatChip } from '@angular/material/chips';
import { PostImageComponent } from '../post-image/post-image.component';
import { PostUrlPipe } from '../../core/utils/post-url.pipe';
import { RouterLink, RouterModule } from '@angular/router';
import { MatAnchor, MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'blog-meetups-header',
  imports: [
    MatChip,
    PostImageComponent,
    PostUrlPipe,
    RouterLink,
    MatAnchor,
    MatButtonModule,
    MatIconModule,
    RouterModule,
  ],
  templateUrl: './meetups-header.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './meetups-header.component.scss',
})
export class MeetupsHeaderComponent {
  @Input() post!: Post;
}
