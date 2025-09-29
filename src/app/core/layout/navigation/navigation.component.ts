import { Component, HostListener, Inject, OnInit } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { LogoComponent } from '../../../components/logo/logo.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { IsActiveDirective } from './is-active.directive';
import { ButtonComponent } from '../../../components/button/button.component';
import { SearchComponent } from '../../../features/search/search.component';
import { DarkModeToggleComponent } from '../dark-mode-toggle/dark-mode-toggle.component';

@Component({
    selector: 'blog-navigation',
    imports: [
        CommonModule,
        LogoComponent,
        MatButtonModule,
        MatIconModule,
        MatListModule,
        MatMenuModule,
        RouterModule,
        MatSidenavModule,
        IsActiveDirective,
        ButtonComponent,
        SearchComponent,
        DarkModeToggleComponent,
    ],
    templateUrl: './navigation.component.html',
    styleUrl: './navigation.component.scss'
})
export class NavigationComponent implements OnInit {
  menuOpen = false;
  isMobile = false;

  private window: Window | undefined = this.document.defaultView?.window;

  protected readonly navigationItems = [
    { link: '/', label: 'Blog', external: false },
    { link: '/principles', label: 'Principles', external: false },
    { link: '/meetups', label: 'Meetups', external: false },
    {
      link: 'https://www.backbase.com/careers',
      label: 'Careers',
      external: true,
    },
  ];

  constructor(@Inject(DOCUMENT) private document: Document) {}

  @HostListener('window:resize', ['$event'])
  onResize(): void {
    this.defineView();
  }

  ngOnInit(): void {
    this.defineView();
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  private defineView() {
    if (!this.window) {
      return;
    }
    const mobileBreakpoint = this.window
      .getComputedStyle(this.document.documentElement)
      .getPropertyValue('--blog-breakpoint-lg')
      .replace('px', '');
    const viewSize = this.window.innerWidth;
    this.isMobile = Number(viewSize) < Number(mobileBreakpoint);
  }
}
