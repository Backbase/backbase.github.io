import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'blog-jobs',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, ButtonComponent],
  templateUrl: './jobs.component.html',
  styleUrl: './jobs.component.scss',
})
export class JobsComponent {}
