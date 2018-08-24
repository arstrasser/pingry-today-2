import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassManagePage } from './class-manage.page';

describe('ClassManagePage', () => {
  let component: ClassManagePage;
  let fixture: ComponentFixture<ClassManagePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClassManagePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClassManagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
