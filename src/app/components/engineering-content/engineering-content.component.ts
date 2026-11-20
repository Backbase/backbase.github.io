import { Component, ChangeDetectionStrategy } from '@angular/core';

import { MatCardModule } from '@angular/material/card';
import { MatRippleModule } from '@angular/material/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'blog-engineering-content',
  imports: [MatCardModule, MatRippleModule, RouterLink],
  templateUrl: './engineering-content.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './engineering-content.component.scss',
})
export class EngineeringContentComponent {}
