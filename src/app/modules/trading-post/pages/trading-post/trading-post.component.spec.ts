import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TradingPostComponent } from './trading-post.component';

describe('TradingPostComponent', () => {
  let component: TradingPostComponent;
  let fixture: ComponentFixture<TradingPostComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TradingPostComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TradingPostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
