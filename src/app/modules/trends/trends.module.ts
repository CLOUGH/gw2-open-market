import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TrendsRoutingModule } from './trends-routing.module';
import { TrendsComponent } from './pages/trends/trends.component';

@NgModule({
  declarations: [TrendsComponent],
  imports: [
    CommonModule,
    TrendsRoutingModule
  ]
})
export class TrendsModule { }
