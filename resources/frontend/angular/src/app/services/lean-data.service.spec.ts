import { TestBed } from '@angular/core/testing';

import { LeanDataService } from './lean-data.service';

describe('LeanDataService', () => {
  let service: LeanDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LeanDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
