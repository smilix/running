import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ListRunsComponent} from './list-runs/list-runs.component';
import {MatTableModule} from "@angular/material/table";
import {MatPaginatorModule} from "@angular/material/paginator";
import {SharedModule} from "../shared/shared.module";
import {EditRunComponent} from './edit-run/edit-run.component';
import {ReactiveFormsModule} from "@angular/forms";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatCardModule} from "@angular/material/card";
import {MatSelectModule} from "@angular/material/select";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {StopWatchComponent} from './edit-run/stop-watch/stop-watch.component';
import {RouterModule} from "@angular/router";


@NgModule({
  declarations: [ListRunsComponent, EditRunComponent, StopWatchComponent],
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    SharedModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    RouterModule
  ]
})
export class RunsModule {
}
