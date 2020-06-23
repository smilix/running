import {NgModule} from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import {FormatDurationPipe} from "./pipes/format-duration.pipe";
import {FormatDatePipe} from "./pipes/format-date.pipe";
import {FormatDistancePipe} from "./pipes/format-distance.pipe";
import {ConfirmComponent, ConfirmService} from './confirm/confirm.component';
import {MatBottomSheetModule} from "@angular/material/bottom-sheet";
import {MatCardModule} from "@angular/material/card";
import {MatButtonModule} from "@angular/material/button";
import {ErrorDialogComponent, ErrorDialogService} from './error-dialog/error-dialog.component';
import {MatDialogModule} from "@angular/material/dialog";
import { WaitingComponent } from './waiting/waiting.component';
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";


@NgModule({
  declarations: [FormatDurationPipe, FormatDatePipe, FormatDistancePipe, ConfirmComponent, ErrorDialogComponent, WaitingComponent],
  exports: [
    FormatDatePipe,
    FormatDistancePipe,
    FormatDurationPipe,
    WaitingComponent
  ],
  imports: [
    CommonModule,
    MatBottomSheetModule,
    MatCardModule,
    MatButtonModule,
    MatDialogModule,
    MatProgressSpinnerModule,
  ],
  providers: [
    DatePipe,
    ConfirmService,
    ErrorDialogService,
  ],
  entryComponents: [
    ConfirmComponent,
    ErrorDialogComponent,
  ]
})
export class SharedModule {
}
