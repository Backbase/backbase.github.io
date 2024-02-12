import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'blog-gradient',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="gradient-container" [ngStyle]="{ height: this.height }"></div>
  `,
  styleUrl: './gradient.component.scss',
})
export class GradientComponent {
  height = '600px';
  @Input('height') set _height(height: number) {
    if (height) {
      this.height = `${height}px`;
    }
  }
}
