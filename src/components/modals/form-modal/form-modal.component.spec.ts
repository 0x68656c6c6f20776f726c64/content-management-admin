import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormCreateModalComponent } from './form-modal.component';

describe('FormCreateModalComponent', () => {
  let component: FormCreateModalComponent;
  let fixture: ComponentFixture<FormCreateModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormCreateModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormCreateModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
