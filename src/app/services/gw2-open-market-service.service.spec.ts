import { TestBed } from '@angular/core/testing';

import { Gw2OpenMarketServiceService } from './gw2-open-market-service.service';

describe('Gw2OpenMarketServiceService', () => {
  let service: Gw2OpenMarketServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Gw2OpenMarketServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
