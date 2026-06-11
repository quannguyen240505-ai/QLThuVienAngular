import { TestBed } from '@angular/core/testing';

import { Reader } from './reader';

describe('Reader', () => {
  let service: Reader;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Reader);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
