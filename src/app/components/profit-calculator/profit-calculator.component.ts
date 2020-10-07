import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-profit-calculator',
  templateUrl: './profit-calculator.component.html',
  styleUrls: ['./profit-calculator.component.scss']
})
export class ProfitCalculatorComponent implements OnInit {
  buy = 0;
  sell = 0;
  quantity = 1;
  @Output()
  closeChange = new EventEmitter<void>();


  constructor() { }

  ngOnInit(): void {
  }

  getListingFee(): number {
    return this.sell ? this.sell * 0.05 * this.quantity : 0;
  }
  getSellingFee(): number {
    return this.sell ? this.sell * 0.10 * this.quantity : 0;
  }
  getProfit(): number {
    return this.sell ? (this.sell - (this.sell * 0.15) - (this.buy)) * this.quantity : 0;
  }

  getROI(): number {
    return Math.round(this.buy ? (this.getProfit() / (this.buy* this.quantity ))* 100 : 0);
  }
  getBreakEven(): number{
    return this.sell * 0.15;
  }

  close(): void {
    this.closeChange.emit();
  }
}
