import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'gw2-open-market';

  showCalculator = false;

  closeCalculator(): void {
    this.showCalculator = false;
  }
}
