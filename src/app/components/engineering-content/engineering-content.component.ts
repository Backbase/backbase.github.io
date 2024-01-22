import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatRippleModule } from '@angular/material/core';
import { Router } from '@angular/router';

@Component({
  selector: 'blog-engineering-content',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatRippleModule],
  templateUrl: './engineering-content.component.html',
  styleUrl: './engineering-content.component.scss',
})
export class EngineeringContentComponent {
  constructor(private router: Router) {}

  navigate(url: string) {
    this.router.navigateByUrl(url);
  }
}
