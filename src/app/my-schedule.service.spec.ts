import { TestBed, inject } from '@angular/core/testing';

import { MyScheduleService } from './my-schedule.service';

describe('MyScheduleService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MyScheduleService]
    });
  });

  it('should be created', inject([MyScheduleService], (service: MyScheduleService) => {
    expect(service).toBeTruthy();
  }));
});
