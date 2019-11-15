import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PriceComparisonChartComponent } from './price-comparison-chart.component';

describe('PriceComparisonChartComponent', () => {
  let component: PriceComparisonChartComponent;
  let fixture: ComponentFixture<PriceComparisonChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PriceComparisonChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PriceComparisonChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
