import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AthleticsPage } from './athletics.page';

describe('AthleticsPage', () => {
  let component: AthleticsPage;
  let fixture: ComponentFixture<AthleticsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AthleticsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AthleticsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
