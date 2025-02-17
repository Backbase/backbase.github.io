import { Component } from '@angular/core';
import { Observable, map } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { PostsService } from '../../services/posts.service';
import { Location } from '../../model/locations.model';
import { LocationsComponent } from '../../../components/locations/locations.component';

@Component({
  selector: 'blog-locations-tab',
  imports: [AsyncPipe, LocationsComponent],
  templateUrl: './locations-tab.component.html',
  styleUrl: './locations-tab.component.scss',
})
export class LocationsTabComponent {
  locations$: Observable<Location[]> = this.postsService.getLocations();

  selectedLocation$ = this.activatedRoute.paramMap.pipe(
    map(params => params.get('loc') as Location)
  );

  constructor(
    private postsService: PostsService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  navigate(selected: string | string[]) {
    this.router.navigate(['meetup', selected]);
  }
}
