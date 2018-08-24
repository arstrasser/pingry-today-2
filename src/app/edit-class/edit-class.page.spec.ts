import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditClassPage } from './edit-class.page';

describe('EditClassPage', () => {
  let component: EditClassPage;
  let fixture: ComponentFixture<EditClassPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditClassPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditClassPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
