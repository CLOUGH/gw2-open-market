import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ItemRoutingModule } from './item-routing.module';
import { ItemComponent } from './pages/item/item.component';
import { ItemListComponent } from './pages/item-list/item-list.component';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { LoadingComponent } from 'src/app/shared/components/loading/loading.component';
import { CoinComponent } from 'src/app/shared/components/coin/coin.component';
import { TradeHistoryChartComponent } from 'src/app/shared/components/trade-history-chart/trade-history-chart.component';

@NgModule({
  declarations: [
    ItemComponent,
    ItemListComponent,
    LoadingComponent,
    CoinComponent,
    TradeHistoryChartComponent
  ],
  imports: [
    CommonModule,
    ItemRoutingModule,
    NgbPaginationModule,
    FormsModule
  ]
})
export class ItemModule { }