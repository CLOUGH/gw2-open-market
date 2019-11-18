import { Subject } from 'rxjs';
import { Component, OnInit, ViewChild, ElementRef, Input, AfterViewInit } from '@angular/core';
import * as buyprices from './buyprices.json';
import * as sellprices from './sellprices.json';
import moment from 'moment';
import * as d3 from 'd3';
import * as randomColor from 'randomcolor';
import { WEEK } from 'ngx-bootstrap/chronos/units/constants';

@Component({
  selector: 'app-price-comparison-chart',
  templateUrl: './price-comparison-chart.component.html',
  styleUrls: ['./price-comparison-chart.component.scss']
})
export class PriceComparisonChartComponent implements OnInit, AfterViewInit {

  @ViewChild('chart') chartElement: ElementRef;
  data: any[];
  viewInitialized = new Subject<void>();

  constructor() { }
  ngOnInit() {

  }
  ngAfterViewInit() {
    this.viewInitialized.next();
  }

  @Input('data')
  set chartData(data: any) {

    this.viewInitialized.subscribe(() => {
      this.data = data;
      console.log(data);
      if (data) {
        this.buildChart(data);
      }

    });
  }

  buildChart(data: any) {
    const weeksBack = 4;
    const weeklyListing = [];
    let maxUnit = 0;
    let minUnitPrice = 0;

    data.buy.forEach((listing, index) => {
      const listingDate = moment.utc(listing.listing_datetime, 'YYYY-MM-DD hh:mm:ss');
      const sundayOfListingDate = moment(listingDate.toDate()).startOf('week').toDate();

      if (moment().startOf('week').diff(moment(sundayOfListingDate), 'week') < weeksBack) {
        const weekIndex = weeklyListing.findIndex(weekListing => {
          return weekListing[0].weekNo === listingDate.week();
        });

        const value = {
          ...listing,
          date: listingDate.toDate(),
          weekNo: listingDate.week(),
          adjustedDate: listingDate.add(moment().startOf('week').diff(sundayOfListingDate, 'week'), 'week').toDate()
        };

        if (weekIndex === -1) {
          weeklyListing.push([value]);
        } else {
          weeklyListing[weekIndex].push(value);
        }

        if (maxUnit < listing.unit_price || index === 0) {
          maxUnit = listing.unit_price;
        }

        if (minUnitPrice >= listing.unit_price || index === 0) {
          minUnitPrice = listing.unit_price;
        }
      }
    });

    const weeklyBuyPrice = [];
    data.sell.forEach((listing, index) => {
      const listingDate = moment.utc(listing.listing_datetime, 'YYYY-MM-DD hh:mm:ss');
      const sundayOfListingDate = moment(listingDate.toDate()).startOf('week').toDate();

      if (moment().startOf('week').diff(moment(sundayOfListingDate), 'week') < weeksBack) {
        const weekIndex = weeklyBuyPrice.findIndex(weekListing => {
          return weekListing[0].weekNo === listingDate.week();
        });

        const value = {
          ...listing,
          date: listingDate.toDate(),
          weekNo: listingDate.week(),
          adjustedDate: listingDate.add(moment().startOf('week').diff(sundayOfListingDate, 'week'), 'week').toDate()
        };

        if (weekIndex === -1) {
          weeklyBuyPrice.push([value]);
        } else {
          weeklyBuyPrice[weekIndex].push(value);
        }

        if (maxUnit < listing.unit_price) {
          maxUnit = listing.unit_price;
        }

        if (minUnitPrice >= listing.unit_price) {
          minUnitPrice = listing.unit_price;
        }
      }
    });

    // set the dimensions and margins of the graph
    const margin = { top: 20, right: 20, bottom: 30, left: 50 };
    const width = 960 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    // parse the date / time
    // const parseTime = d3.timeParse('%d-%b-%y');

    // set the ranges
    const x = d3.scaleTime().range([0, width]);
    const y = d3.scaleLinear().range([height, 0]);

    // define the 1st line
    const line = d3.line()
      .x((d: any) => {
        return x(d.adjustedDate);
      })
      .y((d: any) => y(d.unit_price));


    // append the svg obgect to the body of the page
    // appends a 'group' element to 'svg'
    // moves the 'group' element to the top left margin
    const svg = d3.select(this.chartElement.nativeElement).append('svg')
      .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
      // .attr('width', width + margin.left + margin.right)
      // .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform',
        'translate(' + margin.left + ',' + margin.top + ')');

    // Scale the range of the data
    x.domain([moment().startOf('week').toDate(), moment().endOf('week').toDate()]);
    y.domain([minUnitPrice, maxUnit]);

    // // Add the valueline path.
    weeklyListing.forEach((weekListings: any[]) => {
      // sort the data
      weekListings.sort((a: any, b: any) => {
        return a.adjustedDate - b.adjustedDate;
      });
      const color = randomColor();
      svg.append('path')
        .data([weekListings])
        .attr('fill', 'none')
        .attr('stroke', 'steelblue')
        .attr('stroke-width', (d: any) => {
          return d[0].weekNo === moment().week() ? 4 : 0.5;
        })
        .attr('stroke-linejoin', 'round')
        .attr('stroke-linecap', 'round')
        .attr('d', line);
    });
    weeklyBuyPrice.forEach((weekListings: any[]) => {

      // sort the data
      weekListings.sort((a: any, b: any) => {
        return a.adjustedDate - b.adjustedDate;
      });
      const color = randomColor();
      svg.append('path')
        .data([weekListings])
        .attr('fill', 'none')
        .attr('stroke', 'red')
        .attr('stroke-width', (d: any) => {
          return d[0].weekNo === moment().week() ? 4 : 0.5;
        })
        .attr('stroke-linejoin', 'round')
        .attr('stroke-linecap', 'round')
        .attr('d', line);
    });

    // Add the X Axis
    svg.append('g')
      .attr('transform', 'translate(0,' + height + ')')
      .call(d3.axisBottom(x));

    // Add the Y Axis
    svg.append('g')
      .call(d3.axisLeft(y));


  }

}
