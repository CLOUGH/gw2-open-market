import { Component, OnInit } from '@angular/core';
import { Gw2ApiServiceService } from 'src/app/core/services/gw2-api-service.service';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.scss']
})
export class ItemListComponent implements OnInit {
  itemListOffset = 0;
  itemIds: any[];
  items: any[];
  listSize = 20;
  collectionSize = 0;
  loading = false;

  constructor(private gw2Service: Gw2ApiServiceService) { }

  ngOnInit() {
    this.loading = true;
    this.gw2Service.getCommerceListing()
      .subscribe((itemIds: any[]) => {
        this.loading = false;
        this.itemIds = itemIds;
        this.collectionSize = itemIds.length;

        this.getItems(this.itemListOffset);
      }, this.handleError);
  }

  getItems(offset) {
    this.loading = true;
    const begin = (offset-1) * this.listSize;
    const end = begin + (begin + this.listSize > this.itemIds.length ? this.itemIds.length % this.listSize : this.listSize);
    
    const filteredIds = this.itemIds.slice(begin, end);
    if (filteredIds.length > 0) {
      this.gw2Service.getItems(this.itemIds.slice(begin, end)).subscribe((items: any[]) => {
        this.items = items;
        this.loading = false;
      }, this.handleError);

    }
  }

  pageChanged() {
    if (this.itemIds) {
      this.getItems(this.itemListOffset);
    }
  }

  handleError(error) {
    this.loading = false;
  }

}
