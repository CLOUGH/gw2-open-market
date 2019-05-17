import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
    { path: '', pathMatch: 'full', loadChildren: './modules/landing/landing.module#LandingModule' },
    { path: 'trends', loadChildren: './modules/trends/trends.module#TrendsModule' },
    { path: 'trading-post', loadChildren: './modules/trading-post/trading-post.module#TradingPostModule' },
    { path: 'item', loadChildren: './modules/item/item.module#ItemModule' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { enableTracing: true })],
    exports: [RouterModule]
})
export class AppRoutingModule { }
