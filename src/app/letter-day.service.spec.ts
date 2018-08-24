import { TestBed, inject } from '@angular/core/testing';

import { LetterDayService } from './letter-day.service';

describe('LetterDayService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LetterDayService]
    });
  });

  it('should be created', inject([LetterDayService], (service: LetterDayService) => {
    expect(service).toBeTruthy();
  }));
});
