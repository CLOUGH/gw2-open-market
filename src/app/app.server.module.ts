import { NgModule } from '@angular/core';
import { ServerModule } from '@angular/platform-server';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';

import { AppModule } from './app.module';
import { AppComponent } from './app.component';

@NgModule({
  imports: [
    AppModule,
    ServerModule,
    MatToolbarModule,
    MatButtonModule
  ],
  bootstrap: [AppComponent],
})
export class AppServerModule {}
