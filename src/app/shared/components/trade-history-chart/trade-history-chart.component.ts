import { Component, OnInit, Input } from '@angular/core';
import * as d3 from 'd3';
import * as fc from 'd3fc';
import { Listing } from 'src/app/core/models/listing';
import extentLinear from 'd3fc-extent';

@Component({
  selector: 'app-trade-history-chart',
  templateUrl: './trade-history-chart.component.html',
  styleUrls: ['./trade-history-chart.component.scss']
})
export class TradeHistoryChartComponent implements OnInit {

  constructor() { }

  chart: any;
  buyData: any;
  x: any;
  y: any;
  x2: any;
  yExtent: any;
  xExtent: any

  ngOnInit() {
  }

  @Input('data')
  set chartData(data: any) {
    console.log(data);
    if (data) {
      this.buildChart(data);
    }
  }

  buildChart(data) {
    // convert data
    this.buyData = data.buy.map(d => ({
      date: new Date(d.listing_datetime),
      price: +d.unit_price,
      quantity: +d.quantity
    }));

    this.xExtent = fc.extentDate()
      .accessors([d => d.date]);

    this.yExtent = fc.extentLinear()
      .pad([0.1, 0.1])
      .accessors([d => d.price]);

    // create the scales
    this.x = d3.scaleTime();
    this.y = d3.scaleLinear();
    this.x2 = this.x.copy();

    const lineSeries = fc
      .seriesSvgLine()
      .mainValue(d => d.price)
      .crossValue(d => d.date)
      .decorate((selection) => {
        selection.enter()
          .style('stroke', 'lightblue')
          .style('stroke-opacity', 1);
      });

    const areaSeries = fc
      .seriesSvgArea()
      .baseValue(d => this.yExtent(this.buyData)[0])
      .mainValue(d => d.price)
      .crossValue(d => d.date)
      .decorate((selection) => {
        selection.enter()
          // .style('background-image', 'linear-gradient(white, lightblue)')
          .style('fill', 'lightblue')

          .style('fill-opacity', 0.4);
      });

    // const gridlines = fc
    //   .annotationSvgGridline()
    //   .yTicks(5)
    //   .xTicks(0);

    // const volumeExtent = fc
    //   .extentLinear()
    //   .include([0])
    //   .pad([0, 2])
    //   .accessors([d => d.quantity]);
    // const volumeDomain = volumeExtent(this.buyData);

    // const volumeToPriceScale = d3
    //   .scaleLinear()
    //   .domain(volumeDomain)
    //   .range(this.yExtent(this.buyData));

    // const volumeSeries = fc
    //   .seriesSvgBar()
    //   .bandwidth(2)
    //   .crossValue(d => d.date)
    //   .mainValue(d => volumeToPriceScale(d.quantity))
    //   .decorate(selection =>
    //     selection
    //       .enter()
    //       .classed('quantity', true)
    //       .attr('fill', d => (d.open > d.close ? 'red' : 'green'))
    //   );

    // Build chart
    const multi = fc.seriesSvgMulti()
      // .series([gridlines, areaSeries, lineSeries, volumeSeries]);
      .series([areaSeries]);

    const zoom = d3.zoom()
      .on('zoom', () => {
        // const rescaled = d3.event.transform.rescaleX(this.x2);
        // this.x.domain(rescaled.domain());
        // this.render();
        const t = d3.event.transform;
       
        this.x.domain(t.rescaleX(this.x2).domain());
        this.render();
      });

    this.chart = fc.chartCartesian(this.x, this.y)
      .crossValue((d,i)=> i)
      .mainValue((d) => d)
      // .yDomain(this.yExtent(this.buyData))
      // .xDomain(this.xExtent(this.buyData))
      .svgPlotArea(multi)
      .decorate(selection => {
        selection.enter()
          .select('.plot-area')
          .on('measure.range', () => {
            console.log(this.x2.range([0, d3.event.detail.width]));
            this.x2.range([0, d3.event.detail.width])
          })
          // .call(zoom)
          .call(zoom.transform, d3.zoomIdentity.scale(5));
      });

    this.render();

  }

  render() {
    // const visibleRange = this.buyData.slice(
    //   Math.max(0, this.x.domain()[0]),
    //   Math.min(this.x.domain()[1], this.buyData.length)
    // );
    console.log( this.x.domain(), this.xExtent.min);
    // this.y.domain(this.yExtent(visibleRange));
    this.y.domain(this.yExtent(this.buyData));
    d3.select('#chart')
      .datum(this.buyData)
      .call(this.chart);
  }

  legend() {
    const labelJoin = fc.dataJoin('text', 'legend-label');
    const valueJoin = fc.dataJoin('text', 'legend-value');

    const instance = selection => {
      selection.each((data, selectionIndex, nodes) => {
        labelJoin(d3.select(nodes[selectionIndex]), data)
          .attr('transform', (_, i) => 'translate(50, ' + (i + 1) * 15 + ')')
          .text(d => d.name);

        valueJoin(d3.select(nodes[selectionIndex]), data)
          .attr('transform', (_, i) => 'translate(60, ' + (i + 1) * 15 + ')')
          .text(d => d.value);
      });
    };

    return instance;
  };
}
