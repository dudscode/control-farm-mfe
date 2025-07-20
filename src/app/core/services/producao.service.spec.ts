import { TestBed } from '@angular/core/testing';

import { ProducaoService } from './producao.service';

describe('ProducaoService', () => {
  let service: ProducaoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProducaoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
