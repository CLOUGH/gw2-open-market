import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ItemRoutingModule } from './item-routing.module';
import { ItemComponent } from './pages/item/item.component';
import { ItemListComponent } from './pages/item-list/item-list.component';

@NgModule({
  declarations: [ItemComponent, ItemListComponent],
  imports: [
    CommonModule,
    ItemRoutingModule
  ]
})
export class ItemModule { }
