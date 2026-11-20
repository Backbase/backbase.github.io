import { Component, ChangeDetectionStrategy } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'blog-jobs',
  imports: [MatButtonModule, MatIconModule, ButtonComponent],
  templateUrl: './jobs.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './jobs.component.scss',
})
export class JobsComponent {}
