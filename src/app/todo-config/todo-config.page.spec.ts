import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TodoConfigPage } from './todo-config.page';

describe('TodoConfigPage', () => {
  let component: TodoConfigPage;
  let fixture: ComponentFixture<TodoConfigPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TodoConfigPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TodoConfigPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
