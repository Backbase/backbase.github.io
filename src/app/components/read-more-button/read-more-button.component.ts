import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'blog-read-more-button',
  imports: [MatButtonModule, MatIconModule, RouterModule, ButtonComponent],
  templateUrl: './read-more-button.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './read-more-button.component.scss',
})
export class ReadMoreButtonComponent {
  @Input() link!: string;
  @Input() cta: boolean = false;
}
