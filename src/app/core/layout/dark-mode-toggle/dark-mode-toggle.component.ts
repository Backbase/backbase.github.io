import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleChange, MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ThemeModeService } from '../../services/theme-mode.service';
import { AsyncPipe } from '@angular/common';
import { Observable, map } from 'rxjs';

@Component({
  selector: 'blog-dark-mode-toggle',
  standalone: true,
  imports: [
    MatSlideToggleModule,
    MatIconModule,
    AsyncPipe
  ],
  templateUrl: './dark-mode-toggle.component.html',
  styleUrl: './dark-mode-toggle.component.scss'
})
export class DarkModeToggleComponent {
  dark$ = this.themeModeService.dark$.pipe(map((enabled) => ({ enabled })));

  constructor(private themeModeService: ThemeModeService) {}

  onChange(event: MatSlideToggleChange) {
    this.themeModeService.setDarkMode(event.checked);
  }
}
