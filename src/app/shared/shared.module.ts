import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PriceComparisonChartComponent } from './components/price-comparison-chart/price-comparison-chart.component';
import { CoinComponent } from './components/coin/coin.component';
import { LoadingComponent } from './components/loading/loading.component';
import { TradeHistoryChartComponent } from './components/trade-history-chart/trade-history-chart.component';
import { BuySellChartComponent } from './components/buy-sell-chart/buy-sell-chart.component';

@NgModule({
  declarations: [
    PriceComparisonChartComponent,
    CoinComponent,
    LoadingComponent,
    TradeHistoryChartComponent,
    BuySellChartComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    PriceComparisonChartComponent,
    CoinComponent,
    LoadingComponent,
    TradeHistoryChartComponent,
    BuySellChartComponent
  ]
})
export class SharedModule { }
