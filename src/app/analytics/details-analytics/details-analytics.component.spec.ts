import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsAnalyticsComponent } from './details-analytics.component';

describe('DetailsAnalyticsComponent', () => {
  let component: DetailsAnalyticsComponent;
  let fixture: ComponentFixture<DetailsAnalyticsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailsAnalyticsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailsAnalyticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
