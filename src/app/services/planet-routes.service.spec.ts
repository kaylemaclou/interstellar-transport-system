import { TestBed } from '@angular/core/testing';

import { PlanetRoutesService } from './planet-routes.service';

describe('PlanetRoutesService', () => {
  let service: PlanetRoutesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlanetRoutesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
