import { Component, OnInit, Input } from '@angular/core';
import * as d3 from 'd3';
import * as fc from 'd3fc';
import { Listing } from 'src/app/core/models/listing';

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
    if (data) {
      this.renderChart(data);
    }
  }

  renderChart(data) {
    // convert data
    const buyListings = data.buy.map(d => ({
      date: new Date(d.listing_datetime),
      price: +d.unit_price,
      quantity: +d.quantity
    }));

    const xEtent = fc.extentDate()
      .accessors([d => d.date]);

    const yExtent = fc
      .extentDate()
      .pad([0.1, 0.1])
      .accessors([d => d.price])

    const lineSeries = fc
      .seriesSvgLine()
      .mainValue(d => d.price)
      .crossValue(d => d.date)

    const areaSeries = fc
      .seriesSvgArea()
      .baseValue(d => yExtent(buyListings)[0])
      .mainValue(d => d.price)
      .crossValue(d => d.date);

    const gridlines = fc
      .annotationSvgGridline()
      .yTicks(5)
      .xTicks(0);


    const volumeExtent = fc
      .extentLinear()
      .include([0])
      .pad([0, 2])
      .accessors([d => d.quantity]);
    const volumeDomain = volumeExtent(buyListings);

    const volumeToPriceScale = d3
      .scaleLinear()
      .domain(volumeDomain)
      .range(yExtent(buyListings));

    const volumeSeries = fc
      .seriesSvgBar()
      .bandwidth(2)
      .crossValue(d => d.date)
      .mainValue(d => volumeToPriceScale(d.quantity))
      .decorate(sel =>
        sel
          .enter()
          .classed("quantity", true)
          .attr("fill", d => (d.open > d.close ? "red" : "green"))
      );

    // Build chart
    const multi = fc.seriesSvgMulti()
      .series([gridlines, areaSeries, lineSeries, volumeSeries]);

    const chart = fc.chartCartesian(d3.scaleTime(), d3.scaleLinear())
      .yOrient('right')
      .yDomain(yExtent(buyListings))
      .xDomain(xEtent(buyListings))
      .svgPlotArea(multi);


    d3.select('#chart')
      .datum(buyListings)
      .call(chart);

  }

  legend(){
    const labelJoin = fc.dataJoin("text", "legend-label");
    const valueJoin = fc.dataJoin("text", "legend-value");

    const instance = selection => {
      selection.each((data, selectionIndex, nodes) => {
        labelJoin(d3.select(nodes[selectionIndex]), data)
          .attr("transform", (_, i) => "translate(50, " + (i + 1) * 15 + ")")
          .text(d => d.name);

        valueJoin(d3.select(nodes[selectionIndex]), data)
          .attr("transform", (_, i) => "translate(60, " + (i + 1) * 15 + ")")
          .text(d => d.value);
      });
    };

    return instance;
  };
}
