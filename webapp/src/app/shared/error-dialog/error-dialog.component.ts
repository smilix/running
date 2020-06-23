import {Component, Inject, Injectable, OnInit} from '@angular/core';
import {MonoTypeOperatorFunction, Observable, throwError} from "rxjs";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {catchError} from "rxjs/operators";
import {HttpErrorResponse} from "@angular/common/http";

export interface Options {
  errorMsg: string;
  errorDetails?: string;
  actionLabel?: string;
}

@Component({
  selector: 'app-error-dialog',
  templateUrl: './error-dialog.component.html',
  styleUrls: ['./error-dialog.component.scss']
})
export class ErrorDialogComponent implements OnInit {

  constructor(
    private dialogRef: MatDialogRef<ErrorDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Options) {
  }

  ngOnInit(): void {
  }

  reload() {
    window.location.reload();
  }

  action() {
    this.dialogRef.close(true);
  }
}

@Injectable()
export class ErrorDialogService {

  constructor(private dialog: MatDialog) {
  }

  show(options: Options): Observable<boolean> {

    options.actionLabel = options.actionLabel ?? 'Ignore';
    return this.dialog.open(ErrorDialogComponent, {
      data: options
    })
      .afterClosed();
  }

  catchApiError<T>(actionHint: string): MonoTypeOperatorFunction<T> {
    return catchError((err: HttpErrorResponse) => {
      console.log('API error', err);
      let content: string;
      if (err.error?.reason) {
        content = err.error.reason;
      } else {
        content = JSON.stringify(err.error);
      }
      this.show({
        errorMsg: `The last api request ("${actionHint}") failed.`,
        errorDetails: `${err.message}\n${content}`
      }).subscribe();
      return throwError(err);
    });
  }
}
