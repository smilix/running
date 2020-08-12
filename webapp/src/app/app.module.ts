import {BrowserModule, HAMMER_GESTURE_CONFIG, HammerModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {AkitaNgDevtools} from '@datorama/akita-ngdevtools';
import {environment} from '../environments/environment';
import {SessionModule} from "./session/session.module";
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatIconModule} from "@angular/material/icon";
import {MatListModule} from "@angular/material/list";
import {MatButtonModule} from "@angular/material/button";
import {RunsModule} from "./runs/runs.module";
import {ShoesModule} from "./shoes/shoes.module";
import {SharedModule} from "./shared/shared.module";
import {StatsModule} from "./stats/stats.module";
import {HammerConfig} from "./hammer.config";

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    HammerModule,
    AppRoutingModule,
    environment.production ? [] : AkitaNgDevtools,
    SessionModule,
    StatsModule,
    RunsModule,
    ShoesModule,
    BrowserAnimationsModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatListModule,
    MatButtonModule,
    SharedModule,
  ],
  providers: [
    {
      provide: HAMMER_GESTURE_CONFIG,
      useClass: HammerConfig
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
