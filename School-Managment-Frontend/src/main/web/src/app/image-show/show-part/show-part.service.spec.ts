import { TestBed } from '@angular/core/testing';

import { ShowPartService } from './show-part.service';

describe('ShowPartService', () => {
  let service: ShowPartService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShowPartService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
