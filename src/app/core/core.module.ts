import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule,HttpClientJsonpModule  } from '@angular/common/http';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { StoreRouterConnectingModule  } from '@ngrx/router-store';
import { RouterModule } from '@angular/router';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { appReducers } from './store/app/app.reducer';
import { environment } from 'src/environments/environment';
import { NavigationEffect } from './store/navigation/navigation.effect';

@NgModule({
  declarations: [HeaderComponent, FooterComponent],
  imports: [
    CommonModule,
    RouterModule,
    HttpClientModule,
    HttpClientJsonpModule,
    StoreModule.forRoot(appReducers),
    EffectsModule.forRoot([
      NavigationEffect
    ]),
    // StoreRouterConnectingModule.forRoot({stateKey: 'router'}),
    !environment.production ? StoreDevtoolsModule.instrument({
      maxAge: 25,
      logOnly: false,
      features: {
        pause: false,
        lock: true,
        persist: true
      }
    }) : []
  ],
  exports: [HeaderComponent, FooterComponent]
})
export class CoreModule { }
