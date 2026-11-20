import { Component, ChangeDetectionStrategy } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'blog-divider',
  imports: [MatDividerModule],
  templateUrl: './divider.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './divider.component.scss',
})
export class DividerComponent {}
