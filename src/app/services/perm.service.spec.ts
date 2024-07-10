import { TestBed } from '@angular/core/testing';

import { PermService } from './perm.service';

describe('PermService', () => {
  let service: PermService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PermService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
