import { Component, ChangeDetectionStrategy } from '@angular/core';

import { LogoComponent } from '../../../components/logo/logo.component';

@Component({
  selector: 'blog-footer',
  imports: [LogoComponent],
  templateUrl: './footer.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './footer.component.scss',
})
export class FooterComponent {}
