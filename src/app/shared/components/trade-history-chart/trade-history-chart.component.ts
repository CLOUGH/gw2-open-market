import { Component, OnInit, Input } from '@angular/core';
import * as d3 from "d3";

@Component({
  selector: 'app-trade-history-chart',
  templateUrl: './trade-history-chart.component.html',
  styleUrls: ['./trade-history-chart.component.scss']
})
export class TradeHistoryChartComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  @Input('data')
  set chartData(data: any) {
    console.log(data);
    if(data) {
      d3.select('#chart')
        .datum(da)
        .call()
    }
  }

  getChartData(data) {
  }
}
