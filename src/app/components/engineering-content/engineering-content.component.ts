import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatRippleModule } from '@angular/material/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'blog-engineering-content',
  imports: [MatCardModule, MatRippleModule, RouterLink],
  templateUrl: './engineering-content.component.html',
  styleUrl: './engineering-content.component.scss',
})
export class EngineeringContentComponent {}
