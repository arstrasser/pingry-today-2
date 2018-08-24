import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FullColorPickerPage } from './full-color-picker.page';

describe('FullColorPickerPage', () => {
  let component: FullColorPickerPage;
  let fixture: ComponentFixture<FullColorPickerPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FullColorPickerPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FullColorPickerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
