import { CoinComponent } from './components/coin/coin.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCardModule } from '@angular/material/card';
import { HighchartsChartModule } from 'highcharts-angular';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MarketComponent } from './market/market.component';
import { HomeComponent } from './home/home.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { PortfolioComponent } from './portfolio/portfolio.component';
import { ItemTradeChartComponent } from './components/item-trade-chart/item-trade-chart.component';
import { MatTabsModule } from '@angular/material/tabs';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { ProfitCalculatorComponent } from './components/profit-calculator/profit-calculator.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import {DragDropModule} from '@angular/cdk/drag-drop';
import { RecipeComponent } from './components/recipe/recipe.component';
import {CdkTreeModule} from '@angular/cdk/tree';
import { MainLayoutComponent } from './components/main-layout/main-layout.component';
import { AdminLayoutComponent } from './components/admin-layout/admin-layout.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';

@NgModule({
  declarations: [
    AppComponent,
    MarketComponent,
    HomeComponent,
    CoinComponent,
    PortfolioComponent,
    ItemTradeChartComponent,
    ProfitCalculatorComponent,
    RecipeComponent,
    MainLayoutComponent,
    AdminLayoutComponent,
    AdminDashboardComponent,
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    AppRoutingModule,
    BrowserAnimationsModule,
    MatGridListModule,
    MatToolbarModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    MatExpansionModule,
    MatCardModule,
    HttpClientModule,
    HighchartsChartModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatProgressBarModule,
    MatTabsModule,
    FormsModule,
    ScrollingModule,
    FlexLayoutModule,
    DragDropModule,
    CdkTreeModule

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
