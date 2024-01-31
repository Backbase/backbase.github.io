import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LogoComponent } from '../../../components/logo/logo.component';

@Component({
  selector: 'blog-footer',
  standalone: true,
  imports: [CommonModule, LogoComponent],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class FooterComponent {}
