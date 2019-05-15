import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ItemRoutingModule } from './item-routing.module';
import { ItemComponent } from './pages/item/item.component';
import { ItemListComponent } from './pages/item-list/item-list.component';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { LoadingComponent } from 'src/app/shared/components/loading/loading.component';

@NgModule({
  declarations: [
    ItemComponent,
    ItemListComponent,
    LoadingComponent
  ],
  imports: [
    CommonModule,
    ItemRoutingModule,
    NgbPaginationModule,
    FormsModule
  ]
})
export class ItemModule { }
