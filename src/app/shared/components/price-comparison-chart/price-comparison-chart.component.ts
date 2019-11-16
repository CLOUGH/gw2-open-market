import { Component, OnInit } from '@angular/core';
import * as buyprices from './buyprices.json';
import * as sellprices from './sellprices.json';
import moment from 'moment';
import * as d3 from 'd3';

@Component({
  selector: 'app-price-comparison-chart',
  templateUrl: './price-comparison-chart.component.html',
  styleUrls: ['./price-comparison-chart.component.scss']
})
export class PriceComparisonChartComponent implements OnInit {


  constructor() { }

  ngOnInit() {
    const weeksBack = 4;
    const weeklyListing = [];
    sellprices.results.forEach(listing => {
      const listingDate = moment(listing.listing_datetime);
      if (moment().diff(listingDate.startOf('week'), 'week') < weeksBack) {
        let weekIndex = weeklyListing.findIndex(weekListing => {
          return moment(weekListing[0].listing_datetime).diff(listingDate, 'week') === 0;
        });
        if (weekIndex === -1) {
          weeklyListing.push([]);
          weekIndex = weeklyListing.length - 1;
        }

        weeklyListing[weekIndex].push({
          ...listing,
          date: listingDate.toDate(),
        });
      }
    });
    console.log({weeklyListing});

    // set the dimensions and margins of the graph
    const margin = { top: 20, right: 20, bottom: 30, left: 50 };
    const width = 960 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    // parse the date / time
    const parseTime = d3.timeParse('%d-%b-%y');

    // set the ranges
    const x = d3.scaleTime().range([0, width]);
    const y = d3.scaleLinear().range([height, 0]);

    // define the 1st line
    const valueline = d3.line()
      .x((d: any) => x(d.date))
      .y((d: any) => y(d.close));

    // define the 2nd line
    const valueline2 = d3.line()
      .x((d: any) => x(d.date))
      .y((d: any) => y(d.open));

    // append the svg obgect to the body of the page
    // appends a 'group' element to 'svg'
    // moves the 'group' element to the top left margin
    const svg = d3.select('body').append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform',
        'translate(' + margin.left + ',' + margin.top + ')');

    // Get the data
    // format the data
    // data.forEach((d) => {
    //   d.date = parseTime(d.date);
    //   d.close = +d.close;
    //   d.open = +d.open;
    // });

    // Scale the
    

    // // Add the valueline path.
    // svg.append('path')
    //   .data([data])
    //   .attr('class', 'line')
    //   .attr('d', valueline);

    // // Add the valueline2 path.
    // svg.append('path')
    //   .data([data])
    //   .attr('class', 'line')
    //   .style('stroke', 'red')
    //   .attr('d', valueline2);

    // // Add the X Axis
    // svg.append('g')
    //   .attr('transform', 'translate(0,' + height + ')')
    //   .call(d3.axisBottom(x));

    // // Add the Y Axis
    // svg.append('g')
    //   .call(d3.axisLeft(y));
  }

}
