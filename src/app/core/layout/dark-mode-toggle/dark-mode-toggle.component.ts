import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
  ViewEncapsulation,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import {
  MatSlideToggleChange,
  MatSlideToggleModule,
} from '@angular/material/slide-toggle';
import { ThemeModeService } from '../../services/theme-mode.service';
import { AsyncPipe } from '@angular/common';
import { map } from 'rxjs';

@Component({
  selector: 'blog-dark-mode-toggle',
  standalone: true,
  imports: [MatSlideToggleModule, MatIconModule, AsyncPipe],
  templateUrl: './dark-mode-toggle.component.html',
  styleUrl: './dark-mode-toggle.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class DarkModeToggleComponent implements AfterViewInit {
  @ViewChild('darkModeSwitch', { read: ViewContainerRef })
  toggler!: ViewContainerRef;
  @ViewChild('customIcons', { static: true }) darkIcon!: TemplateRef<any>;

  dark$ = this.themeModeService.dark$.pipe(map(enabled => ({ enabled })));

  constructor(private themeModeService: ThemeModeService) {}

  ngAfterViewInit(): void {
    const original = this.toggler.element.nativeElement.querySelector(
      '.mdc-switch__icons'
    ) as HTMLElement;
    const customIcons = this.toggler.createEmbeddedView(this.darkIcon);
    original.replaceChildren(...customIcons.rootNodes);
  }

  onChange(event: MatSlideToggleChange) {
    this.themeModeService.setDarkMode(event.checked);
  }
}
