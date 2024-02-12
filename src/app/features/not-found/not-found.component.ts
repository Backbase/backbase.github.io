import { Component } from '@angular/core';
import { ButtonComponent } from '../../components/button/button.component';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'blog-not-found',
  standalone: true,
  imports: [ButtonComponent, MatButtonModule, RouterLink],
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss'],
})
export class NotFoundComponent {}
