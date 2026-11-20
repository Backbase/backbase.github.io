import { Component, ChangeDetectionStrategy } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatRippleModule } from '@angular/material/core';

@Component({
  selector: 'blog-meetup-footer',
  imports: [MatCardModule, MatRippleModule],
  templateUrl: './meetup-footer.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './meetup-footer.component.scss',
})
export class MeetupFooterComponent {}
