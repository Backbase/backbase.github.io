import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { Category } from '../../core/model/categories.model';

@Component({
  selector: 'blog-category-title',
  imports: [],
  templateUrl: './category-title.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './category-title.component.scss',
})
export class CategoryTitleComponent {
  @Input() section!: string | null;
}
