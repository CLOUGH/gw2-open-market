import { Component, OnInit } from '@angular/core';
import { Gw2ApiServiceService } from 'src/app/core/services/gw2-api-service.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Gw2SpidyServiceService } from 'src/app/core/services/gw2-spidy-service.service';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss']
})
export class ItemComponent implements OnInit {
  item: any;
  price: any;
  listings: any;
  listingsData: any;

  constructor(
    private gw2ApiService: Gw2ApiServiceService,
    private route: ActivatedRoute,
    private gw2SpidyService: Gw2SpidyServiceService
  ) { }

  ngOnInit() {
    const itemId = this.route.snapshot.paramMap.get('id');
    this.gw2ApiService.getListings(itemId).subscribe(listings => {
      this.listings = listings;
    });
    this.gw2ApiService.getItem(itemId)
      .subscribe(item => {
        this.item = item;
      });
    this.gw2SpidyService.getItemListings(itemId)
      .subscribe(listingsData => {
        this.listingsData = listingsData;
      });
  }

}
