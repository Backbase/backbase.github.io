import { Component, Input } from '@angular/core';
import { Post } from '../../core/model/post.model';
import { MatChip } from '@angular/material/chips';
import { PostImageComponent } from '../post-image/post-image.component';
import { PostUrlPipe } from '../../core/utils/post-url.pipe';
import { RouterLink, RouterModule } from '@angular/router';
import { ButtonComponent } from '../button/button.component';
import { MatAnchor, MatButtonModule } from '@angular/material/button';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'blog-meetups-header',
  standalone: true,
  imports: [
    MatChip,
    PostImageComponent,
    PostUrlPipe,
    RouterLink,
    ButtonComponent,
    MatAnchor,
    MatIcon,
    CommonModule,
    MatButtonModule,
    MatIconModule,
    RouterModule,
    ButtonComponent,
  ],
  templateUrl: './meetups-header.component.html',
  styleUrl: './meetups-header.component.scss',
})
export class MeetupsHeaderComponent {
  @Input() post!: Post;
}
