import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-coin',
  templateUrl: './coin.component.html',
  styleUrls: ['./coin.component.scss']
})
export class CoinComponent implements OnInit {

  public copper = 0;
  public silver = 0;
  public gold = 0;
  public isNegative = false;

  @Input('units')
  set setUnits(units: any) {
    this.copper = this.getCopper(+units);
    this.silver = this.getSilver(+units);
    this.gold = this.getGold(+units);
    this.isNegative = +units < 0;
  }

  constructor() { }

  ngOnInit() {

  }

  getCopper(units) {
    return Math.floor(Math.abs(units) % 100);
  }

  getSilver(units) {
    return Math.floor((Math.abs(units) % 10000) / 100);
  }

  getGold(units) {
    return Math.floor(Math.abs(units) / 10000);
  }

}
