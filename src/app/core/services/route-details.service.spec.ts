import { TestBed } from '@angular/core/testing';

import { RouteDetailsService } from './route-details.service';

describe('RouteDetailsService', () => {
  let service: RouteDetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RouteDetailsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
