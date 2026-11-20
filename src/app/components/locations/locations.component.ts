import {
  Component,
  EventEmitter,
  Input,
  Output,
  ChangeDetectionStrategy,
} from '@angular/core';

import { MatTabChangeEvent, MatTabsModule } from '@angular/material/tabs';
import { Location } from '../../core/model/locations.model';

@Component({
  selector: 'blog-locations',
  imports: [MatTabsModule],
  templateUrl: './locations.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './locations.component.scss',
})
export class LocationsComponent {
  @Input() locations!: Location[];
  @Input() active!: Location | null;
  @Output() selected = new EventEmitter<string | string[]>();

  Location = Object.fromEntries(Object.entries(Location));

  onChange(event: MatTabChangeEvent) {
    this.selected.emit(event.tab.labelClass);
  }
}
