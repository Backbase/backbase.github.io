import { DOCUMENT, NgClass, NgStyle } from '@angular/common';
import { Component, Inject, Input } from '@angular/core';

@Component({
    selector: 'blog-transition',
    imports: [NgStyle, NgClass],
    templateUrl: './transition.component.html',
    styleUrl: './transition.component.scss'
})
export class TransitionComponent {
  colorFrom!: string | undefined;
  colorTo!: string | undefined;
  @Input() type: 'right' | 'left' = 'right';
  @Input('colorFrom') set _colorFrom(value: string) {
    this.colorFrom = `var(--blog-palette-${value})`;
  }
  @Input('colorTo') set _colorTo(value: string) {
    this.colorTo = `var(--blog-palette-${value})`;
  }

  constructor(@Inject(DOCUMENT) private document: Document) {}
}
