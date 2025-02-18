import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatRippleModule } from '@angular/material/core';

@Component({
  selector: 'blog-meetup-footer',
  standalone: true,
  imports: [MatCardModule, MatRippleModule],
  templateUrl: './meetup-footer.component.html',
  styleUrl: './meetup-footer.component.scss',
})
export class MeetupFooterComponent {
}
