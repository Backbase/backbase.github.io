import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'blog-logo',
  imports: [CommonModule],
  templateUrl: './logo.component.html',
  styleUrl: './logo.component.scss',
})
export class LogoComponent {
  private _size = 2.5;

  @Input() set size(value: number | undefined) {
    if (value) {
      this._size = value;
    }
  }

  get size(): string {
    return `${this._size}em`;
  }
}
