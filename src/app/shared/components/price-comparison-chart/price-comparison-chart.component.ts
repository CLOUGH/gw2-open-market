import { Component, OnInit } from '@angular/core';
import * as buyprices from './buyprices.json';
import * as sellprices from './sellprices.json';
import * as moment from 'moment';

@Component({
  selector: 'app-price-comparison-chart',
  templateUrl: './price-comparison-chart.component.html',
  styleUrls: ['./price-comparison-chart.component.scss']
})
export class PriceComparisonChartComponent implements OnInit {


  constructor() { }

  ngOnInit() {

  }

}
