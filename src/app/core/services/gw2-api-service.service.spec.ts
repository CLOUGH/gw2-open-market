import { TestBed } from '@angular/core/testing';

import { Gw2ApiServiceService } from './gw2-api-service.service';

describe('Gw2ApiServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: Gw2ApiServiceService = TestBed.get(Gw2ApiServiceService);
    expect(service).toBeTruthy();
  });
});
