import { TestBed } from '@angular/core/testing';

import { Gw2SpidyServiceService } from './gw2-spidy-service.service';
import { HttpClientModule, HttpClientJsonpModule } from '@angular/common/http';

describe('Gw2SpidyServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      HttpClientModule,
      HttpClientJsonpModule
    ]
  }));

  it('should be created', () => {
    const service: Gw2SpidyServiceService = TestBed.get(Gw2SpidyServiceService);
    expect(service).toBeTruthy();
  });
});
