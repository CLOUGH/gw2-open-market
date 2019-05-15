import { Component, OnInit } from '@angular/core';
import { Gw2ApiServiceService } from 'src/app/core/services/gw2-api-service.service';

@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.scss']
})
export class ItemListComponent implements OnInit {
  itemListOffset = 0;
  itemIds: any[];
  items: any[];
  listSize = 10;
  collectionSize = 0;

  constructor(private gw2Service: Gw2ApiServiceService) { }

  ngOnInit() {
    this.gw2Service.getItems()
    .subscribe((itemIds: any[]) => {
      this.itemIds = itemIds;
      this.collectionSize = itemIds.length;
      this.getItems(this.itemListOffset);
    });
  }
  
  getItems(offset) {
    this.gw2Service.getItems(this.itemIds.slice(offset, offset +this.listSize)).subscribe((items: any[]) => {
      this.items = items;
    });
  }

  pageChanged(){
    if(this.itemIds){
      this.getItems(this.itemListOffset);
    }
  }

}
