import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemTradeChartComponent } from './item-trade-chart.component';

describe('ItemTradeChartComponent', () => {
  let component: ItemTradeChartComponent;
  let fixture: ComponentFixture<ItemTradeChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ItemTradeChartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemTradeChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
