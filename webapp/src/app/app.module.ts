import {BrowserModule} from '@angular/platform-browser';
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
import {MatTableModule} from "@angular/material/table";
import {SharedModule} from "./shared/shared.module";
import {StatsModule} from "./stats/stats.module";

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
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
  // providers: [{provide: NG_ENTITY_SERVICE_CONFIG, useValue: {baseUrl: 'https://jsonplaceholder.typicode.com'}}],
  bootstrap: [AppComponent]
})
export class AppModule {
}
