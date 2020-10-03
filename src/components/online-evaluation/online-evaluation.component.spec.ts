import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OnlineEvaluationComponent } from './online-evaluation.component';

describe('OnlineEvaluationComponent', () => {
  let component: OnlineEvaluationComponent;
  let fixture: ComponentFixture<OnlineEvaluationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OnlineEvaluationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OnlineEvaluationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
