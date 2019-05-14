import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ItemComponent } from './pages/item/item.component';
import { ItemListComponent } from './pages/item-list/item-list.component';

const routes: Routes = [
  { path: '', component: ItemListComponent },
  { path: ':id', component: ItemComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ItemRoutingModule { }
