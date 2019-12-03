import { Component, OnInit, Input, ElementRef, ViewChild, ViewEncapsulation, AfterViewInit } from '@angular/core';
import * as d3 from 'd3';
import { Listing } from 'src/app/core/models/listing';
import { Observable, of, Subject } from 'rxjs';
import moment from 'moment';

interface TradeData {
  date: Date;
  price: number;
  quantity: number;
}
@Component({
  selector: 'app-trade-history-chart',
  templateUrl: './trade-history-chart.component.html',
  styleUrls: ['./trade-history-chart.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TradeHistoryChartComponent implements OnInit, AfterViewInit {
  data: any[];
  viewInitialized = new Subject<void>();

  width: any;
  height: number;
  margin: any;
  svg: any;
  buyData: any[];
  @ViewChild('chart') chartElement: ElementRef;
  bisectDate: (array: ArrayLike<any>, x: any, lo?: number, hi?: number) => number;
  xScale: any;
  yScale: any;
  yVolumeScale: any;
  focus: any;
  yScale2: any;
  xScale2: any;
  yVolumeScale2: any;
  baseSvg: any;
  svgBase: any;
  sellData: any[];
  ySellScale: any;
  xAxis: any;
  yAxis: any;
  line: any;
  margin2: { top: number; right: number; bottom: number; left: number; };
  height2: number;
  xAxis2: any;
  brush: any;
  line2: any;
  context: any;
  zoom: any;
  yScale3: any;
  profitData: any[];
  profitLine: any;
  yAxis2: any;
  xAxis3: any;
  xScale3: any;
  yAxis3: any;
  height3: number;
  margin3: { top: number; right: number; bottom: number; left: number; };
  context2: any;
  enableYScaling = true;
  constructor(private el: ElementRef) { }

  ngOnInit() {
  }



  ngAfterViewInit() {
    this.viewInitialized.next();
  }

  @Input('data')
  set chartData(data: any) {

    this.viewInitialized.subscribe(() => {
      this.data = data;
      // console.log(data);
      if (data) {
        this.buildChart(data);
      }

    });
  }

  getPrevious(values: any[], index: number) {
    // console.log(values,index);
    for (let i = index; i >= 0; i--) {
      if (values[i]) {
        return values[i];
      }
    }

    return null;
  }

  buildChart(data) {
    // convert data
    this.buyData = data.buy.map(d => ({
      date: moment.utc(d.listing_datetime, 'YYYY-MM-DD hh:mm:ss').toDate(),
      price: +d.unit_price,
      quantity: +d.quantity,
      profit: d.unit_price
    })).sort((a, b) => a.date - b.date);

    this.sellData = data.sell.map(d => ({
      date: moment.utc(d.listing_datetime, 'YYYY-MM-DD hh:mm:ss').toDate(),
      price: +d.unit_price,
      quantity: +d.quantity
    })).sort((a, b) => a.date - b.date);

    this.profitData = this.sellData.map((d, i) => {
      return {
        date: d.date,
        profit: (d.price - d.price * 0.15) - this.getPrevious(this.buyData, i).price
      };
    });

    this.svg = d3.select(this.chartElement.nativeElement);
    this.margin = { top: 20, right: 50, bottom: 310, left: 20 };
    this.margin2 = { top: 530, right: 50, bottom: 20, left: 20 };
    this.margin3 = { top: 330, right: 20, bottom: 110, left: 50 };
    this.width = +this.svg.attr('width') - this.margin.left - this.margin.right;
    this.height = +this.svg.attr('height') - this.margin.top - this.margin.bottom;
    this.height2 = +this.svg.attr('height') - this.margin2.top - this.margin2.bottom;
    this.height3 = +this.svg.attr('height') - this.margin3.top - this.margin3.bottom;

    const xMin = d3.min(this.buyData, d => d.date);
    const xMax = d3.max(this.buyData, d => d.date);
    const yMin = d3.min(this.buyData.concat(this.sellData), d => d.price);
    const yMax = d3.max(this.buyData.concat(this.sellData), d => d.price);
    const yMinVolume = d3.min(this.buyData.concat(this.sellData), d => Math.min(d.quantity));
    const yMaxVolume = d3.max(this.buyData.concat(this.sellData), d => Math.max(d.quantity));
    const profitMin = d3.min(this.profitData, d => Math.min(d.profit));
    const profitMax = d3.max(this.profitData, d => Math.max(d.profit));

    const focusDate0 = moment().subtract(1, 'weeks').toDate();
    const focusDate1 = new Date();

    this.xScale = d3.scaleTime().domain([xMin, xMax]).range([0, this.width]);
    this.xScale2 = d3.scaleTime().domain([xMin, xMax]).range([0, this.width]);
    this.xScale3 = d3.scaleTime().domain([xMin, xMax]).range([0, this.width]);
    this.yScale = d3.scaleLinear().domain([yMin - 5, yMax]).range([this.height, 0]);
    this.yScale2 = d3.scaleLinear().domain([yMin - 5, yMax]).range([this.height2, 0]);
    this.yScale3 = d3.scaleLinear().domain([profitMin - 5, profitMax]).range([this.height3, 0]);
    this.yVolumeScale = d3.scaleLinear().domain([yMinVolume, yMaxVolume]).range([this.height, this.height * (3 / 4)]);

    this.zoom = d3.zoom()
      .scaleExtent([1, Infinity])
      .translateExtent([[0, 0], [this.width, this.height]])
      .extent([[0, 0], [this.width, this.height]])
      .on('zoom', this.zoomed.bind(this));

    this.xAxis = d3.axisBottom(this.xScale);
    this.xAxis2 = d3.axisBottom(this.xScale2);
    this.xAxis3 = d3.axisBottom(this.xScale3);
    this.yAxis = d3.axisRight(this.yScale);
    this.yAxis2 = d3.axisLeft(this.yScale2);
    this.yAxis3 = d3.axisLeft(this.yScale3);

    // console.log(this.height, this.height2, this.height3);
    this.brush = d3.brushX()
      .extent([[0, 0], [this.width, this.height2]])
      .on('brush end', this.brushed.bind(this));

    this.line = d3.line()
      .x((d: any) => this.xScale(d.date))
      .y((d: any) => this.yScale(d.price));
    this.line2 = d3.line()
      .x((d: any) => this.xScale2(d.date))
      .y((d: any) => this.yScale2(d.price));
    this.profitLine = d3.line()
      .x((d: any) => this.xScale3(d.date))
      .y((d: any) => this.yScale3(d.profit))

    this.svg.append('defs')
      .append('clipPath')
      .attr('id', 'clip')
      .append('rect')
      .attr('width', this.width)
      .attr('height', this.height);

    this.focus = this.svg.append('g')
      .attr('class', 'focus')
      .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');

    this.context2 = this.svg.append('g')
      .attr('class', 'context')
      .attr('transform', 'translate(' + this.margin3.left + ',' + this.margin3.top + ')');

    this.context = this.svg.append('g')
      .attr('class', 'context')
      .attr('transform', 'translate(' + this.margin2.left + ',' + this.margin2.top + ')');


    this.focus
      .append('path')
      .data([this.buyData])
      .style('fill', 'none')
      .attr('class', 'buyLine')
      .attr('stroke', 'steelblue')
      .attr('stroke-width', '1.5')
      .attr('d', this.line);
    this.focus
      .append('path')
      .data([this.profitData])
      .style('fill', 'none')
      .attr('class', 'profitLine')
      .attr('stroke', 'green')
      .attr('stroke-width', '1.5')
      .attr('d', this.profitLine);
    this.focus
      .append('path')
      .data([this.sellData])
      .style('fill', 'none')
      .attr('class', 'sellLine')
      .attr('stroke', 'red')
      .attr('stroke-width', '1.5')
      .attr('d', this.line);

    this.context.append('path')
      .datum(this.sellData)
      .attr('class', 'area')
      .style('fill', 'none')
      .attr('stroke', 'red')
      .attr('d', this.line2);
    this.context.append('path')
      .datum(this.buyData)
      .attr('class', 'area')
      .style('fill', 'none')
      .attr('stroke', 'steelblue')
      .attr('d', this.line2);
    this.context.append('g')
      .attr('class', 'axis axis--x')
      .attr('transform', `translate(0,${this.height2})`)
      .call(this.xAxis2);
    this.context.append('g')
      .attr('class', 'brush')
      .call(this.brush)
      .call(this.brush.move, this.xScale.range());

    this.focus
      .append('g')
      .attr('class', 'demand')
      .selectAll('rect')
      .data(this.buyData)
      .join('rect')
      .attr('x', d => this.xScale(d.date) + 10)
      .attr('y', d => this.yVolumeScale(d.quantity))
      .attr('width', 1)
      .attr('height', d => this.height - this.yVolumeScale(d.quantity))
      .attr('fill-opacity', '0.5')
      .attr('fill', '#c0392b');
    this.focus
      .append('g')
      .attr('class', 'supply')
      .selectAll('rect')
      .data(this.sellData)
      .join('rect')
      .attr('x', d => this.xScale(d.date))
      .attr('y', d => this.yVolumeScale(d.quantity))
      .attr('width', 1)
      .attr('height', d => this.height - this.yVolumeScale(d.quantity))
      .attr('fill-opacity', '0.5')
      .attr('fill', '#03a678');
    this.focus.append('g')
      .attr('class', 'axis axis--x')
      .attr('transform', `translate(0, ${this.height})`)
      .call(this.xAxis);
    this.focus.append('g')
      .attr('class', 'axis axis--y')
      .attr('transform', `translate(${this.width}, 0)`)
      .call(this.yAxis);

    this.context2
      .append('g')
      .attr('class', 'profit')
      .selectAll('rect')
      .data(this.profitData)
      .join('rect')
      .attr('x', d => this.xScale3(d.date))
      .attr('y', d => this.yScale3(Math.max(0, d.profit)))
      .attr('width', this.width / this.profitData.length)
      .attr('height', d => Math.abs(this.yScale3(d.profit) - this.yScale3(0)))
      // .attr('fill-opacity', '0.5')
      .attr('fill', d => {
        return (+d.profit) > 0 ? '#79ea86' : '	#e75757';
      });
    // this.context2
    //   .append('path')
    //   .data([this.profitData])
    //   .style('fill', 'none')
    //   .attr('class', 'profit')
    //   .attr('stroke', 'red')
    //   .attr('stroke-width', '1.5')
    //   .attr('d', this.profitLine);
    this.context2.append('g')
      .attr('class', 'axis axis--y3')
      // .attr('transform', `translate(${this.height3},0)`)
      .call(this.yAxis3);
    this.context2.append('g')
      .attr('class', 'axis axis--x3')
      .attr('transform', `translate(0, ${this.height3})`)
      .call(this.xAxis3);


    this.svg.append('rect')
      .attr('class', 'zoom')
      .attr('width', this.width)
      .attr('height', this.height + this.height3 + 40)
      .attr('transform', `translate( ${this.margin.left}, ${this.margin.top})`)
      .call(this.zoom)
      .transition()
      .duration(1500)
      .call(this.zoom.transform, d3.zoomIdentity
        .scale(this.width / (this.xScale(focusDate1) - this.xScale(focusDate0)))
        .translate(-this.xScale(focusDate0), 0)
      )



    // renders x and y crosshair
    // this.focus = this.svg
    //   .append('g')
    //   .attr('class', 'focus')
    //   .style('display', 'none');
    // this.focus.append('circle').attr('r', 4.5);
    // this.focus.append('line').classed('x', true);
    // this.focus.append('line').classed('y', true);

    // this.svg
    //   .append('rect')
    //   .attr('class', 'overlay')
    //   .attr('width', this.width)
    //   .attr('height', this.height)
    //   .on('mouseover', () => this.focus.style('display', null))
    //   .on('mouseout', () => this.focus.style('display', 'none'));
    // .on('mousemove', this.generateCrosshair.bind(this));

    // d3.select('.overlay').style('fill', 'none');
    // d3.select('.overlay').style('pointer-events', 'all');
    // d3.selectAll('.focus line').style('fill', 'none');
    // d3.selectAll('.focus line').style('stroke', '#67809f');
    // d3.selectAll('.focus line').style('stroke-width', '1.5px');
    // d3.selectAll('.focus line').style('stroke-dasharray', '3 3');
    // returs insertion point
    // this.bisectDate = d3.bisector((d: any) => d.date).right;

    // const d0 = moment().subtract(2, 'weeks').toDate();
    // const d1 = new Date();
    // this.svg.call(zoom)
    //   .transition()
    //   .duration(1500)
    //   .call(zoom.transform, d3.zoomIdentity
    //     .scale(this.width / (this.xScale(d1) - this.xScale(d0)))
    //     .translate(-this.xScale(d0), 0));
  }
  brushed() {
    if (d3.event.sourceEvent && d3.event.sourceEvent.type === 'zoom') { return; } // ignore brush-by-zoom
    const s = d3.event.selection || this.xScale2.range();
    this.xScale.domain(s.map(this.xScale2.invert, this.xScale2));
    this.xScale3.domain(s.map(this.xScale2.invert, this.xScale2));

    this.focus.select('.buyLine').attr('d', this.line);
    this.focus.select('.sellLine').attr('d', this.line);
    this.focus.select('.profitLine').attr('d', this.line);
    this.focus.select('.axis--x').call(this.xAxis);
    this.focus.select('.axis--y').call(this.yAxis);

    // this.context2.select('.profit').attr('d', this.profitLine);
    this.context2.select('.axis--x3').call(this.xAxis3);
    this.context2.select('.axis--y3').call(this.yAxis3);

    this.svg.select('.zoom').call(this.zoom.transform, d3.zoomIdentity
      .scale(this.width / (s[1] - s[0]))
      .translate(-s[0], 0));

  }

  zoomed() {
    if (d3.event.sourceEvent && d3.event.sourceEvent.type === 'brush') { return; } // ignore zoom-by-brush
    const t = d3.event.transform;
    this.xScale.domain(t.rescaleX(this.xScale2).domain());
    this.xScale3.domain(t.rescaleX(this.xScale2).domain());
    const domain = this.xScale.domain();
    const profitDomain = this.xScale3.domain();

    const data = this.sellData.concat(this.buyData);
    // const xt = t.rescaleX(this.xScale);
    this.yScale.domain([d3.min(data.map((d) => {
      if (d.date > domain[0] && d.date < domain[1]) {
        return parseFloat(d.price);
      }
    })), d3.max(data.map((d) => {
      if (d.date > domain[0] && d.date < domain[1]) {
        return d.price;
      }
    }))]);
    this.focus.select('.axis--y').call(this.yAxis);


    // profit y domain
    const profitYScaleMinMax = [d3.min(this.profitData.map((d) => {
      if (d.date > profitDomain[0] && d.date < profitDomain[1]) {
        return d.profit;
      }
    })), d3.max(this.profitData.map((d) => {
      if (d.date > profitDomain[0] && d.date < profitDomain[1]) {
        return d.profit;
      }
    }))];

    // console.log('[min, max]', profitYScaleMinMax);
    this.yScale3.domain(profitYScaleMinMax);
    this.context2.select('.axis--y3').call(this.yAxis3);
    const scale = d3.event.transform.k;
    const bandWidth = Math.max(Math.abs(Math.log10(scale)), 1) * 1;
    // console.log(bandWidth);
    this.focus.selectAll('.demand rect').attr('x', (d: any) => this.xScale(d.date) + bandWidth).attr('width', bandWidth);
    this.focus.selectAll('.supply rect').attr('x', (d: any) => this.xScale(d.date)).attr('width', bandWidth);
    this.focus.select('.sellLine').attr('d', this.line);
    this.focus.select('.buyLine').attr('d', this.line);
    this.focus.select('.profitLine').attr('d', this.line);
    this.focus.select('.axis--x').call(this.xAxis);

    this.context2.selectAll('.profit rect')
      .attr('x', (d: any) => this.xScale(d.date))
      .attr('y', d => this.yScale3(Math.max(0, d.profit)))
      .attr('height', d => {
        return Math.abs(this.yScale3(d.profit) - this.yScale3(profitYScaleMinMax[0] < 0 ? 0 : profitYScaleMinMax[0]))
      })
      .attr('width', bandWidth);
    this.context2.select('.axis--x3').call(this.xAxis);

    this.context.select('.brush').call(this.brush.move, this.xScale.range().map(t.invertX, t));

  }

  generateCrosshair(arg0: string, generateCrosshair: any) {
    // returns corresponding value from the domain
    const correspondingDate: any = this.xScale.invert(d3.mouse(d3.event.target)[0]);

    // gets insertion point
    const i = this.bisectDate(this.buyData, correspondingDate, 1);

    const d0 = this.buyData[i - 1];
    const d1 = this.buyData[i];
    const currentPoint = correspondingDate - d0.date > d1.date - correspondingDate ? d1 : d0;
    // console.log(i, correspondingDate);

    this.focus.attr(
      'transform',
      `translate(${this.xScale(currentPoint.date)}, ${this.yScale(currentPoint.price)})`
    );

    this.focus
      .select('line.x')
      .attr('x1', 0)
      .attr('x2', this.width - this.xScale(currentPoint.date))
      .attr('y1', 0)
      .attr('y2', 0);

    this.focus
      .select('line.y')
      .attr('x1', 0)
      .attr('x2', 0)
      .attr('y1', 0)
      .attr('y2', this.height - this.yScale(currentPoint.price));

    // updates the legend to display the date, open, close, high, low, and volume of the selected mouseover area
    this.updateLegends(currentPoint);
  }

  updateLegends(currentPoint: any) {
    d3.selectAll('.lineLegend').remove();

    const legendKeys = Object.keys(this.buyData[0]);
    const lineLegend = this.svg
      .selectAll('.lineLegend')
      .data(legendKeys)
      .enter()
      .append('g')
      .attr('class', 'lineLegend')
      .attr('transform', (d, i) => `translate(0, ${i * 20})`);

    lineLegend
      .append('text')
      .text(d => {
        if (d === 'date') {
          return `${d.charAt(0).toUpperCase() + d.slice(1)}: ${moment(currentPoint[d]).format('MMMM Do YYYY, h:mm:ss a')}`;
        } if (d === 'price') {
          return `Buy: ${currentPoint[d]}`;
        } else {
          return `${d.charAt(0).toUpperCase() + d.slice(1)}: ${currentPoint[d]}`;
        }
      })
      // .style('fill', 'white')
      .attr('transform', 'translate(15,9)'); // align texts with boxes
  }
}


