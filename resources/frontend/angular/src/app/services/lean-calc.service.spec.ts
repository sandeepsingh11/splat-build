import { TestBed } from '@angular/core/testing';

import { LeanCalcService } from './lean-calc.service';

describe('LeanCalcService', () => {
  let service: LeanCalcService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LeanCalcService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
