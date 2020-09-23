import { ItemFilterOption, ItemCategory } from './../models/item-filter-option';
import { IItemTradeListing } from './../../server/models/ItemTradeListing';
import { IItem } from './../../server/models/Item';
import { ItemsSearchFilter } from './../models/items-search-filter';
import { AfterViewInit, Component, OnInit, ViewChild, PLATFORM_ID, Inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { Gw2OpenMarketServiceService } from '../services/gw2-open-market-service.service';
import * as moment from 'moment';
import * as Highcharts from 'highcharts/highstock';
import theme from 'highcharts/themes/dark-unica';
import HC_exporting from 'highcharts/modules/exporting';
import { isPlatformBrowser, isPlatformServer, Location } from '@angular/common';
import { NgForm } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-market',
  templateUrl: './market.component.html',
  styleUrls: ['./market.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class MarketComponent implements OnInit, AfterViewInit {

  itemIds: any[];
  items: IItem[];
  collectionSize = 0;
  loading = false;
  filter: ItemsSearchFilter = { page: 1, limit: 25 };
  displayedColumns: string[] = ['id', 'name', 'buy', 'sell', 'profit', 'roi', 'demand', 'supply', 'updated', 'actions'];
  pageSizeOptions: number[] = [10, 25, 50, 100];
  expandedElement: any | null;
  isHighcharts = typeof Highcharts === 'object';
  Highcharts: typeof Highcharts;
  chartOptions: Highcharts.Options;
  showChart = false;
  chartIsLoading = false;
  @ViewChild('filterForm') filterForm: NgForm;
  @ViewChild(MatSort) sort: MatSort;
  subCategoryOptions = [];

  itemFilterOptions: ItemFilterOption = {
    categories: [
      { label: '', value: '' },
      {
        label: 'Armor', value: 'Armor', subCategory: [
          { label: '', value: '' },
          { label: 'Coat', value: 'Coat' },
          { label: 'Leggings', value: 'Leggings' },
          { label: 'Gloves', value: 'Gloves' },
          { label: 'Helm', value: 'Helm' },
          { label: 'Aquatic Helm', value: 'HelmAquatic' },
          { label: 'Boots', value: 'Boots' },
          { label: 'Shoulders', value: 'Shoulders' }
        ]
      },
      { label: 'Back', value: 'Back' },
      {
        label: 'Trinket', value: 'Trinket', subCategory: [
          { label: '', value: '' },
          { label: 'Accessory', value: 'Accessory' },
          { label: 'Amulet', value: 'Amulet' },
          { label: 'Ring', value: 'Ring' }
        ]
      },
      {
        label: 'Weapon', value: 'Weapon', subCategory: [
          { label: '', value: '' },
          { label: 'Dagger', value: 'Dagger' },
          { label: 'Focus', value: 'Focus' },
          { label: 'Greatsword', value: 'Greatsword' },
          { label: 'Hammer', value: 'Hammer' },
          { label: 'Longbow', value: 'Longbow' },
          { label: 'Sword', value: 'Sword' },
          { label: 'Shortbow', value: 'Shortbow' },
          { label: 'Mace', value: 'Mace' },
          { label: 'Pistol', value: 'Pistol' },
          { label: 'Rifle', value: 'Rifle' },
          { label: 'Scepter', value: 'Scepter' },
          { label: 'Staff', value: 'Staff' },
          { label: 'Torch', value: 'Torch' },
          { label: 'Warhorn', value: 'Warhorn' },
          { label: 'Shield', value: 'Shield' },
          { label: 'Spear', value: 'Spear' },
          { label: 'Harpoon Gun', value: 'Harpoon Gun' },
          { label: 'Trident', value: 'Trident' }
        ]
      },
      {
        label: 'Consumable', value: 'Consumable', subCategory: [
          { label: '', value: '' },
          { label: 'Food Effect', value: 'Food' },
          { label: 'Utility Effect', value: 'Utility' },
          { label: 'Generic', value: 'Generic' },
          { label: 'Skin', value: 'Transmutation' },
          { label: 'Unlock', value: 'Unlock' }
        ]
      },
      {
        label: 'Upgrade Component', value: 'Upgrade Component', subCategory: [
          { label: 'Weapon Sigil', value: 'Weapon Sigil' },
          { label: 'Armour Run', value: 'Armour Run' },
          { label: 'Other', value: 'Other' }
        ]
      },
      { label: 'Packaged Good', value: 'Packaged Good' },
      { label: 'Crafting Material', value: 'Crafting Material' },
      { label: 'Miscellaneous', value: 'Miscellaneous' },
      { label: 'Mini', value: 'Mini' },
      { label: 'Trophy', value: 'Trophy' },
      { label: 'Inventory Bag', value: 'Bag' },
      {
        label: 'Gathering', value: 'Gathering', subCategory: [
          { label: '', value: '' },
          { label: 'Mining', value: 'Mining' },
          { label: 'Logging', value: 'Logging' },
          { label: 'Foraging', value: 'Foraging' },
        ]
      }
    ],
    rarity: [
      { label: '', value: '' },
      {label:'Basic', value: 'Basic'},
      {label:'Fine', value: 'Fine'},
      {label:'Masterwork', value: 'Masterwork'},
      {label:'Rare', value: 'Rare'},
      {label:'Exotic', value: 'Exotic'},
      {label:'Ascended', value: 'Ascended'},
      {label:'Legendary', value: 'Legendary'},
    ]
  };

  constructor(
    private activatedRoute: ActivatedRoute,
    private gw2OpenMarketService: Gw2OpenMarketServiceService,
    private router: Router,
    private location: Location,
    @Inject(PLATFORM_ID) private platform: Object
  ) {
    console.log({ initChartModules: typeof Highcharts === 'object' });
    if (typeof Highcharts === 'object') {
      HC_exporting(Highcharts);
      theme(Highcharts);
    }
    this.Highcharts = Highcharts;
  }

  ngOnInit(): void {
    this.loading = true;
    this.activatedRoute.queryParams.subscribe(queryParams => {
      if (queryParams) {
        this.filter = queryParams;
      }
      console.log({isPlatformServer: isPlatformServer(this.platform)});
      if (isPlatformServer(this.platform)===false) {
        this.getItems();
      }
    });
  }

  ngAfterViewInit(): void {

    this.filterForm.valueChanges.subscribe(value => {
      const selectedCategory = this.getSelectedCategory(value);
      this.subCategoryOptions = selectedCategory && selectedCategory.subCategory ? selectedCategory.subCategory : [];

      if (this.subCategoryOptions.length === 0) {
        this.filter = {
          ...this.filter,
          subCategory: ''
        };
      }
    });
  }

  getItems(): void {
    this.updateUrl();

    console.log({sort: this.sort});
    this.gw2OpenMarketService
      .getItems(this.filter)
      .subscribe((res: HttpResponse<IItem[]>) => {
        this.loading = false;
        this.items = res.body;
        this.collectionSize = +res.headers.get('X-LENGTH');
        this.filter = {
          ...this.filter,
          limit: +res.headers.get('X-LIMIT'),
          page: +res.headers.get('X-PAGE'),
        };
      }, () => {
        this.loading = false;
      });
  }
  getTimeAgo(date: Date): string {
    return moment(date).fromNow();
  }

  getSelectedCategory(value): ItemCategory {
    return value.category ? this.itemFilterOptions.categories.find(category => category.value === value.category) : null;
  }

  getTradeHistory(item): void {
    this.showChart = false;
    this.chartIsLoading = true;
    this.gw2OpenMarketService.getItemTradeListing(item.id).subscribe((itemTradeListing: HttpResponse<IItemTradeListing>) => {
      this.showChart = true;

      const buySeries = itemTradeListing.body.buys.map(buy => {
        return [
          moment(buy.timestamp).valueOf(),
          buy.unit_price,
        ];
      }).sort((a, b) => a[0] - b[0]);
      const sellSeries = itemTradeListing.body.sells.map(buy => {
        return [
          moment(buy.timestamp).valueOf(),
          buy.unit_price,
        ];
      }).sort((a, b) => a[0] - b[0]);

      const demandSeries = itemTradeListing.body.buys.map(buy => {
        return [
          moment(buy.timestamp).valueOf(),
          buy.quantity,
        ];
      }).sort((a, b) => a[0] - b[0]);
      const supplySeries = itemTradeListing.body.sells.map(sell => {
        return [
          moment(sell.timestamp).valueOf(),
          sell.quantity,
        ];
      }).sort((a, b) => a[0] - b[0]);

      const breakEvenSeries = sellSeries.map(([timestamp, sellPrice]) => {
        return [timestamp, sellPrice - (sellPrice * 0.15)];
      });

      this.chartOptions = {
        rangeSelector: {
          allButtonsEnabled: true,
          buttons: [
            {
              type: 'day',
              count: 1,
              text: '1d'
            },
            {
              type: 'week',
              count: 1,
              text: '1w'
            }, {
              type: 'month',
              count: 1,
              text: '1m'
            }, {
              type: 'month',
              count: 3,
              text: '3m'
            }, {
              type: 'month',
              count: 6,
              text: '6m'
            }, {
              type: 'ytd',
              text: 'YTD'
            }, {
              type: 'year',
              count: 1,
              text: '1y'
            }, {
              type: 'all',
              text: 'All'
            }],
          selected: 1
        },
        title: {
          text: item.name
        },
        yAxis: [{
          height: '60%',
          labels: {
            align: 'right',
            x: -3
          },
          title: {
            text: 'Price',
            style: {
              color: Highcharts.getOptions().colors[1]
            }
          },
          lineWidth: 2,
        }, {
          top: '65%',
          height: '35%',
          labels: {
            align: 'right',
            x: -3
          },
          title: {
            text: 'Volume',
            style: {
              color: Highcharts.getOptions().colors[4]
            }
          },
          offset: 0,
          lineWidth: 2
        }],
        series: [
          {
            data: buySeries,
            type: 'spline',
            name: 'Buy',
            yAxis: 0,
            tooltip: {
              valueDecimals: 2
            }
          },
          {
            data: sellSeries,
            type: 'spline',
            name: 'Sell',
            yAxis: 0,
            tooltip: {
              valueDecimals: 2
            }
          },
          {
            data: breakEvenSeries,
            type: 'line',
            dashStyle: 'Dot',
            name: 'Break Even',
            yAxis: 0,
            tooltip: {
              valueDecimals: 2
            }
          },
          {
            data: demandSeries,
            type: 'line',
            name: 'Demand',
            yAxis: 1,
            tooltip: {
              valueDecimals: 2
            }
          },
          {
            data: supplySeries,
            type: 'line',
            name: 'Supply',
            yAxis: 1,
            tooltip: {
              valueDecimals: 2
            }
          },
        ]
      };
      this.chartIsLoading = false;
    });
  }

  onPageChange(event): void {
    this.filter.page = event.pageIndex + 1;
    this.filter.limit = event.pageSize;
    this.getItems();
  }

  updateUrl(): void {
    const url = this.router.createUrlTree([{}], {
      relativeTo: this.activatedRoute,
      queryParams: {
        ...this.filter,
      }
    })
      .toString();
    this.location.go(url);
  }

  handleError(error) {
    this.loading = false;
  }

  toggleItemDetail(item: IItem): void {
    this.expandedElement = this.expandedElement === item ? null : item;

    if (this.expandedElement) {
      this.getTradeHistory(item);
    }
  }

  getProfit(sellPrice, buyPrice) {
    return sellPrice - (sellPrice * 0.15) - buyPrice;
  }
  getROI(sellPrice, buyPrice) {
    return Math.round(this.getProfit(sellPrice, buyPrice) / (buyPrice === 0 ? 0.00001 : buyPrice) * 100);
  }
  copyToClipBoard(val: string): void {
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = val;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
  }
}
