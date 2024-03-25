import { TestBed } from '@angular/core/testing';

import { ObservabilityService } from './observability.service';

describe('ObservabilityService', () => {
  let service: ObservabilityService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ObservabilityService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
