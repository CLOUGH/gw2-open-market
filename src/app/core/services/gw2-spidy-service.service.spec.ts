import { TestBed } from '@angular/core/testing';

import { Gw2SpidyServiceService } from './gw2-spidy-service.service';

describe('Gw2SpidyServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: Gw2SpidyServiceService = TestBed.get(Gw2SpidyServiceService);
    expect(service).toBeTruthy();
  });
});
