import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { Gw2ApiServiceService } from './gw2-api-service.service';
import { HttpClientJsonpModule, HttpClientModule } from '@angular/common/http';

describe('Gw2ApiServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      HttpClientModule,
      HttpClientJsonpModule
    ]
  }));

  it('should be created', () => {
    const service: Gw2ApiServiceService = TestBed.get(Gw2ApiServiceService);
    expect(service).toBeTruthy();
  });
});
