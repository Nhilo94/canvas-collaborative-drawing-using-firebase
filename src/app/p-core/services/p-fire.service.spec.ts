import { TestBed } from '@angular/core/testing';

import { PFireService } from './p-fire.service';

describe('PFireService', () => {
  let service: PFireService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PFireService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
