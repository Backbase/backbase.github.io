import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NavigationComponent } from './core/layout/navigation/navigation.component';
import { FooterComponent } from './core/layout/footer/footer.component';

@Component({
  selector: 'blog-root',
  standalone: true,
  imports: [CommonModule, NavigationComponent, FooterComponent, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'blog';
}
