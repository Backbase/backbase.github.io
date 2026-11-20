import {
  Component,
  EventEmitter,
  Input,
  Output,
  ChangeDetectionStrategy,
} from '@angular/core';

import { MatTabChangeEvent, MatTabsModule } from '@angular/material/tabs';
import { Category } from '../../core/model/categories.model';

@Component({
  selector: 'blog-categories',
  imports: [MatTabsModule],
  templateUrl: './categories.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './categories.component.scss',
})
export class CategoriesComponent {
  @Input() categories!: Category[];
  @Input() active!: Category | null;
  @Output() selected = new EventEmitter<string | string[]>();

  Category = Object.fromEntries(Object.entries(Category));

  onChange(event: MatTabChangeEvent) {
    this.selected.emit(event.tab.labelClass);
  }
}
