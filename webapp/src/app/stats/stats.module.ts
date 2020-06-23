import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MonthlyComponent} from './monthly/monthly.component';
import {OverviewComponent} from "./overview/overview.component";
import {MatCardModule} from "@angular/material/card";
import {MatTableModule} from "@angular/material/table";
import {SharedModule} from "../shared/shared.module";
import {RouterModule} from "@angular/router";
import {MatButtonModule} from "@angular/material/button";
import {SimpleStatsTableComponent} from "./simple-stats-table/simple-stats-table.component";


@NgModule({
  declarations: [OverviewComponent, MonthlyComponent, SimpleStatsTableComponent],
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    SharedModule,
    RouterModule,
    MatButtonModule
  ]
})
export class StatsModule {
}
