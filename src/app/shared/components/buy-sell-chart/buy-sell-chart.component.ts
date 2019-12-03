import { Component, OnInit, Input, ElementRef, ViewChild } from '@angular/core';
import moment from 'moment';

import * as d3 from 'd3';

interface Listing {
  listing_datetime: string;
  listings: number;
  quantity: number;
  unit_price: number;
}
interface Data {
  buy: Listing[];
  sell: Listing[];
}

@Component({
  selector: 'app-buy-sell-chart',
  templateUrl: './buy-sell-chart.component.html',
  styleUrls: ['./buy-sell-chart.component.scss']
})
export class BuySellChartComponent implements OnInit {

  @ViewChild('chart') chartElement: ElementRef;

  @Input('data') set data(data: Data) {
    if (data) {
      this.drawChart(data);
    }
  }
  constructor() { }

  ngOnInit() {
  }

  drawChart(data: Data) {
    const mainMargin = { top: 20, right: 40, bottom: 110, left: 20 };
    const zoomMargin = { top: 430, right: 40, bottom: 30, left: 20 };
    const width = 960 - mainMargin.left - mainMargin.right;
    const mainHeight = 500 - mainMargin.top - mainMargin.bottom;
    const zoomHeight = 500 - zoomMargin.top - zoomMargin.bottom;

    const svg = d3.select(this.chartElement.nativeElement)
      .attr('viewBox', `0 0 ${width + mainMargin.left + mainMargin.right} ${mainHeight + mainMargin.top + mainMargin.bottom}`)
    // .attr('transform', `translate(${mainMargin.left}, ${mainMargin.top})`);

    // find data range
    const xMin = d3.min(data.buy, (d: Listing) => {
      return moment.utc(d.listing_datetime, 'YYYY-MM-DD hh:mm:ss').toDate();
    });
    const xMax = d3.max(data.buy, (d: Listing) => {
      return moment.utc(d.listing_datetime, 'YYYY-MM-DD hh:mm:ss').toDate();
    });
    const yBuyMin = d3.min(data.buy, (d: Listing) => {
      return +d.unit_price;
    });
    const yBuyMax = d3.max(data.buy, (d: Listing) => {
      return +d.unit_price;
    });
    const ySellMin = d3.min(data.sell, (d: Listing) => {
      return +d.unit_price;
    });
    const ySellMax = d3.max(data.sell, (d: Listing) => {
      return +d.unit_price;
    });

    const yMin = Math.min(ySellMin, yBuyMin);
    const yMax = Math.max(ySellMax, yBuyMax);

    // scales for the charts
    const mainXScale = d3
      .scaleTime()
      .domain([xMin, xMax])
      .range([0, width]);
    const mainYScale = d3
      .scaleLinear()
      .domain([yMin - 5, yMax])
      .range([mainHeight, 0]);
    const zoomXScale = d3
      .scaleTime()
      .domain([xMin, xMax])
      .range([0, width]);
    const zoomYScale = d3
      .scaleLinear()
      .domain([yMin - 5, yMax])
      .range([zoomHeight, 0]);


    const mainXAxis = d3.axisBottom(mainXScale);
    const zoomXAxis = d3.axisBottom(zoomXScale);
    const yAxis = d3.axisRight(mainYScale);

    const line: any = d3.line()
      .x((d: any) => {
        return mainXScale(moment.utc(d.listing_datetime, 'YYYY-MM-DD hh:mm:ss').toDate());
      })
      .y((d: any) => {
        return mainYScale(d.unit_price);
      });
    const zoomLine: any = d3.line()
      .x((d: any) => {
        return zoomXScale(moment.utc(d.listing_datetime, 'YYYY-MM-DD hh:mm:ss').toDate());
      })
      .y((d: any) => {
        return zoomYScale(d.unit_price);
      });
    const profitLine: any = d3.line()
      .x((d: any) => {
        return mainXScale(moment.utc(d.listing_datetime, 'YYYY-MM-DD hh:mm:ss').toDate());
      })
      .y((d: any) => {
        // sell price - (sellprice * trading post tax)
        return mainYScale(d.unit_price - (d.unit_price * 0.15));
      });

    const mainChart = svg.append('g')
      .attr('class', 'focus')
      .attr('transform', `translate(${mainMargin.left}, ${mainMargin.top})`)
      .attr('clip-path', 'url(#clip)');
    const focus = svg.append('g')
      .attr('class', 'focus')
      .attr('transform', `translate(${mainMargin.left}, ${mainMargin.top})`);
    const context = svg.append('g')
      .attr('class', 'context')
      .attr('transform', `translate(${zoomMargin.left}, ${zoomMargin.top})`);

    const zoom = d3.zoom()
      .scaleExtent([1, Infinity])
      .translateExtent([[0, 0], [width, mainHeight]])
      .extent([[0, 0], [width, mainHeight]])
      .on('zoom', () => {
        console.log(d3.event.sourceEvent && d3.event.sourceEvent.type);
        // ignore zoom-by-brush
        if (d3.event.sourceEvent && d3.event.sourceEvent.type === 'brush') {
          return;
        }
        const t = d3.event.transform;
        mainXScale.domain(t.rescaleX(zoomXScale).domain());
        const mainDomain = mainXScale.domain();


        const zoomBuyRange = data.buy.filter(d => {
          return moment.utc(d.listing_datetime, 'YYYY-MM-DD hh:mm:ss').toDate() > mainDomain[0]
            && moment.utc(d.listing_datetime, 'YYYY-MM-DD hh:mm:ss').toDate() < mainDomain[1]
        });
        const zoomSellRange = data.sell.filter(d => {
          return moment.utc(d.listing_datetime, 'YYYY-MM-DD hh:mm:ss').toDate() > mainDomain[0]
            && moment.utc(d.listing_datetime, 'YYYY-MM-DD hh:mm:ss').toDate() < mainDomain[1]
        });
        const zoomProfitRange = data.sell.filter(d => {
          return moment.utc(d.listing_datetime, 'YYYY-MM-DD hh:mm:ss').toDate() > mainDomain[0]
            && moment.utc(d.listing_datetime, 'YYYY-MM-DD hh:mm:ss').toDate() < mainDomain[1]
        }).map(d => {
          return {
            listing_datetime: d.listing_datetime,
            listings: d.listings,
            quantity: d.quantity,
            unit_price: d.unit_price * 0.15
          } as Listing;
        });

        const currentYMin = d3.min(zoomSellRange.concat(zoomBuyRange, zoomProfitRange), d => {
          return +d.unit_price;
        });
        const currentYMax = d3.max(zoomSellRange.concat(zoomBuyRange, zoomProfitRange), d => {
          return +d.unit_price;
        });
        mainYScale.domain([currentYMin, currentYMax]);
        focus.select('.axis--y').call(yAxis);

        // mainChart.select('.line').attr('d', line);
        mainChart.select('.sell-line').attr('d', line);
        mainChart.select('.buy-line').attr('d', line);
        mainChart.select('.profit-line').attr('d', profitLine);
        focus.select('.axis--x').call(mainXAxis);

        // context.select('.brush').call(brush.move, mainXScale.range().map(t.invertX, t));
      });

    // const brush = d3.brushX()
    //   .extent([0, 0], [width, zoomHeight])
    //   .on('brush end', () => {
    //     console.log(d3.event.sourceEvent && d3.event.sourceEvent.type);
    //     // ignore brush-by-zoom
    //     if (d3.event.sourceEvent && d3.event.sourceEvent.type === 'zoom') {
    //       return;
    //     }
    //     const s = d3.event.selection || zoomXScale.range();
    //     mainXScale.domain(s.map(zoomXScale.invert, zoomXScale));
    //     // mainChart.select('.line').attr('d', line);
    //     mainChart.select('.sell-line').attr('d', line);
    //     mainChart.select('.buy-line').attr('d', line);
    //     mainChart.select('.line').attr('d', line);
    //     focus.select('.axis--x').call(mainXAxis);
    //     svg.select('.zoom').call(zoom.transform, d3.zoomIdentity
    //       .scale(width / (s[1] - s[0]))
    //       .translate(-s[0], 0));
    //   });



    focus.append('g')
      .attr('class', 'axis axis--x')
      .attr('transform', `translate(0, ${mainHeight})`)
      .call(mainXAxis);
    focus.append('g')
      .attr('class', 'axis axis--y')
      .attr('transform', `translate(${width}, 0)`)
      .call(yAxis);

    mainChart.append('path')
      .datum(data.buy)
      .style('fill', 'none')
      .attr('class', 'buy-line')
      .attr('stroke', 'steelblue')
      .attr('d', line);
    mainChart.append('path')
      .datum(data.sell)
      .style('fill', 'none')
      .attr('class', 'sell-line')
      .attr('stroke', 'green')
      .attr('d', line);
    mainChart.append('path')
      .datum(data.sell)
      .style('fill', 'none')
      .attr('class', 'profit-line')
      .attr('stroke', '#FF8900')
      .attr('d', profitLine);

    context.append('path')
      .datum(data.sell)
      .style('fill', 'none')
      .attr('class', 'line')
      .attr('id', 'zoomLine')
      .attr('stroke', 'steelblue')
      .attr('d', zoomLine);
    context.append('g')
      .attr('class', 'axis axis--x')
      .attr('transform', `translate(0, ${zoomHeight})`)
      .call(zoomXAxis);
    context.append('g')
      .attr('class', 'brush')
    // .call(brush)
    // .call(brush.move, mainXScale.range());

    svg.append('rect')
      .attr('class', 'zoom')
      .attr('width', width)
      .attr('height', mainHeight)
      .style('fill', 'none')
      .style('pointer-events', 'all')
      .style('cursor', 'move')
      .attr('transform', `translate(${mainMargin.left}, ${mainMargin.top})`)
      .call(zoom);
  }

}
