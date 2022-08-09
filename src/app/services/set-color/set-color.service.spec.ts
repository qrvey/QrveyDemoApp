import { TestBed } from '@angular/core/testing';

import { SetColorService } from './set-color.service';

describe('SetColorService', () => {
  let service: SetColorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SetColorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
