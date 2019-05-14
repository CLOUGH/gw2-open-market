import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TradingPostRoutingModule } from './trading-post-routing.module';
import { TradingPostComponent } from './pages/trading-post/trading-post.component';

@NgModule({
  declarations: [TradingPostComponent],
  imports: [
    CommonModule,
    TradingPostRoutingModule
  ]
})
export class TradingPostModule { }
