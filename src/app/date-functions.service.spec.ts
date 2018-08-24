import { TestBed, inject } from '@angular/core/testing';

import { DateFunctionsService } from './date-functions.service';

describe('DateFunctionsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DateFunctionsService]
    });
  });

  it('should be created', inject([DateFunctionsService], (service: DateFunctionsService) => {
    expect(service).toBeTruthy();
  }));
});
