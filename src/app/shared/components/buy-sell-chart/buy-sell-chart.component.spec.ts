import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BuySellChartComponent } from './buy-sell-chart.component';

describe('BuySellChartComponent', () => {
  let component: BuySellChartComponent;
  let fixture: ComponentFixture<BuySellChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BuySellChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuySellChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
