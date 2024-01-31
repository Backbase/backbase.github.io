import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LogoComponent } from '../../../components/logo/logo.component';
import { ButtonComponent } from '../../../components/button/button.component';
import { MatAnchor } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter, map } from 'rxjs';

@Component({
  selector: 'blog-footer',
  standalone: true,
  imports: [
    CommonModule,
    LogoComponent,
    ButtonComponent,
    MatAnchor,
    MatIcon,
    RouterLink,
  ],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class FooterComponent {
  isAuthorsPage$ = this.router.events.pipe(
    filter((event): event is NavigationEnd => event instanceof NavigationEnd),
    map((event: NavigationEnd) => event.url === '/authors')
  );

  constructor(private router: Router) {}
}
