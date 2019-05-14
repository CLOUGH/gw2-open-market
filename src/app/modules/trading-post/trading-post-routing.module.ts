import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TradingPostComponent } from './pages/trading-post/trading-post.component';

const routes: Routes = [
  { path: '',  component: TradingPostComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TradingPostRoutingModule { }
