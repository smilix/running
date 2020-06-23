import {Component, Inject, Injectable, OnInit} from '@angular/core';
import {MAT_BOTTOM_SHEET_DATA, MatBottomSheet, MatBottomSheetRef} from "@angular/material/bottom-sheet";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";

interface MsgData {
  msg: string;
}

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.scss']
})
export class ConfirmComponent implements OnInit {

  constructor(
    private bottomSheetRef: MatBottomSheetRef<ConfirmComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: MsgData,
  ) {
  }

  ngOnInit(): void {
  }

  yes() {
    this.bottomSheetRef.dismiss(true);
  }

  no() {
    this.bottomSheetRef.dismiss(false);
  }
}

@Injectable()
export class ConfirmService {

  constructor(private bottomSheet: MatBottomSheet) {
  }

  confirmDeletion(msg: string): Observable<boolean> {

    const ref = this.bottomSheet.open(ConfirmComponent, {
      data: {
        msg: msg
      } as MsgData
    });

    return ref.afterDismissed().pipe(map(result => !!result));
  }
}
