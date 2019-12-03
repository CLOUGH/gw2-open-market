import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-filter-form',
  templateUrl: './filter-form.component.html',
  styleUrls: ['./filter-form.component.scss']
})
export class FilterFormComponent implements OnInit {

  @Input() filter: any;
  @Output() filterChange = new EventEmitter<any>();

  constructor() { }

  ngOnInit() {
  }

  onSubmit() {
    this.filterChange.emit(this.filter);
  }

}
