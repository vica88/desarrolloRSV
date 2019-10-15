import { TestBed } from '@angular/core/testing';

import { InteractionWithMapService } from './interaction-with-map.service';

describe('DataMapService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: InteractionWithMapService = TestBed.get(InteractionWithMapService);
    expect(service).toBeTruthy();
  });
});
