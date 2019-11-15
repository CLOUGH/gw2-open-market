import { TestBed } from '@angular/core/testing';

import { Gw2OpenMarketService } from './gw2-open-market.service';
import { HttpClientModule } from '@angular/common/http';

describe('Gw2OpenMarketService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      HttpClientModule
    ]
  }));

  it('should be created', () => {
    const service: Gw2OpenMarketService = TestBed.get(Gw2OpenMarketService);
    expect(service).toBeTruthy();
  });
});
