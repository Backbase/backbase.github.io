import { Component, Input } from '@angular/core';
import { Category } from '../../core/model/categories.model';

@Component({
  selector: 'blog-category-title',
  standalone: true,
  imports: [],
  templateUrl: './category-title.component.html',
  styleUrl: './category-title.component.scss',
})
export class CategoryTitleComponent {
  @Input() section!: string | null;
}
