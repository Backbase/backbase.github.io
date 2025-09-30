import { Component, OnInit } from '@angular/core';
import { ButtonComponent } from '../../components/button/button.component';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { ObservabilityService } from '../../core/services/observability.service';

@Component({
  selector: 'blog-not-found',
  imports: [ButtonComponent, MatButtonModule, RouterLink],
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss'],
})
export class NotFoundComponent implements OnInit {
  constructor(private observabilityService: ObservabilityService) {}

  ngOnInit(): void {
    this.observabilityService.publishEvent({}, 'not-found');
  }
}
