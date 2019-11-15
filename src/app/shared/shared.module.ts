import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PriceComparisonChartComponent } from './components/price-comparison-chart/price-comparison-chart.component';

@NgModule({
  declarations: [PriceComparisonChartComponent],
  imports: [
    CommonModule
  ],
  exports: [PriceComparisonChartComponent]
})
export class SharedModule { }
