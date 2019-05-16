import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TradeHistoryChartComponent } from './trade-history-chart.component';

describe('TradeHistoryChartComponent', () => {
  let component: TradeHistoryChartComponent;
  let fixture: ComponentFixture<TradeHistoryChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TradeHistoryChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TradeHistoryChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
