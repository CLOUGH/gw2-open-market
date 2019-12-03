import { Gw2OpenMarketService } from './../../../../core/services/gw2-open-market.service';
import { Component, OnInit } from '@angular/core';
import { Gw2ApiServiceService } from 'src/app/core/services/gw2-api-service.service';
import { Location } from '@angular/common';
import { Router, ActivatedRoute, RoutesRecognized } from '@angular/router';
import { IAppState } from 'src/app/core/store/app/app.state';
import { Store } from '@ngrx/store';
import { SetPreviousUrl } from 'src/app/core/store/navigation/navigation.action';
import { HttpResponse } from '@angular/common/http';

interface ItemFilter {
  page?: number;
  limit?: number;
  search?: string;
}

@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.scss']
})
export class ItemListComponent implements OnInit {
  itemIds: any[];
  items: any[];
  collectionSize = 0;
  loading = false;
  filter: ItemFilter = {};

  constructor(
    private gw2Service: Gw2ApiServiceService,
    private location: Location,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private store: Store<IAppState>,
    private gw2OpenMarketService: Gw2OpenMarketService
  ) { }

  ngOnInit() {
    this.loading = true;
    this.activatedRoute.queryParams.subscribe(queryParams => {
      if (queryParams.page) {
        this.filter.page = +queryParams.page;
      }
      if (queryParams.size) {
        this.filter.limit = +queryParams.size;
      }
      this.getItems();
    });
  }

  getItems() {
    this.gw2OpenMarketService
      .getItems(this.filter)
      .subscribe((res: HttpResponse<any>) => {
        this.loading = false;
        this.items = res.body;
        this.collectionSize = +res.headers.get('X-LENGTH');
        this.filter = {
          ...this.filter,
          limit: +res.headers.get('X-LIMIT'),
          page: +res.headers.get('X-PAGE'),
        };
      }, this.handleError)
  }

  onPageChange () {
    this.updateUrl();
    this.onFilterChange();
  }

  onFilterChange() {
    console.log(this.filter)
    this.getItems();
  }
  updateUrl() {
    const url = this.router
      .createUrlTree([{}], {
        relativeTo: this.activatedRoute,
        queryParams: {
          size: this.filter.limit,
          page: this.filter.page
        }
      })
      .toString();
    this.location.go(url);
    this.store.dispatch(new SetPreviousUrl(url));
  }

  handleError(error) {
    this.loading = false;
  }

}
