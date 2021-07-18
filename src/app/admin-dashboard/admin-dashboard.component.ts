import { Component, OnInit } from '@angular/core';
import { Gw2OpenMarketServiceService } from '../services/gw2-open-market-service.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {

  constructor(private gw2OpenMarketService: Gw2OpenMarketServiceService) { }

  ngOnInit(): void {
  }

  updateItemList() {
    
    this.gw2OpenMarketService.updateItemList().subscribe(() => {
      console.log('Price update running')
    });
  }

}
