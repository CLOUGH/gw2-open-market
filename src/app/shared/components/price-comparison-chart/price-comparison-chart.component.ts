import { Component, OnInit } from '@angular/core';
import * as buyprices from './buyprices.json';
import * as sellprices from './sellprices.json';
import moment from 'moment';

@Component({
  selector: 'app-price-comparison-chart',
  templateUrl: './price-comparison-chart.component.html',
  styleUrls: ['./price-comparison-chart.component.scss']
})
export class PriceComparisonChartComponent implements OnInit {


  constructor() { }

  ngOnInit() {
    const weeksBack = 4;
    const weeklyListing = {};
    sellprices.results.forEach(listing => {
      const listingDate = moment(listing.listing_datetime,moment.ISO_8601);
      if (moment().diff(listingDate.startOf('week'), 'week') < weeksBack) {

        if (!weeklyListing[listingDate.week()]) {
          weeklyListing[listingDate.week()] = [];
        }
        weeklyListing[listingDate.week()].push(listing);
      }
    });
    // console.log(weeklyListing);
    
  }

}
