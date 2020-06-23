import {ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {timer} from "rxjs";
import {takeWhile} from "rxjs/operators";

@Component({
  selector: 'app-stop-watch',
  templateUrl: './stop-watch.component.html',
  styleUrls: ['./stop-watch.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StopWatchComponent implements OnInit, OnDestroy {

  @Output()
  timerValue = new EventEmitter<number>();

  @Input()
  disabled = false;

  value = 0;
  running = false;

  private start: number;
  private oldValue = 0;

  constructor(private changeDetectorRef: ChangeDetectorRef) {
  }

  ngOnInit(): void {
  }

  ngOnDestroy() {
    this.running = false;
  }

  toggle() {
    this.running = !this.running;

    if (this.running) {
      this.start = Date.now();

      timer(1000, 1000).pipe(
        takeWhile(() => this.running))
        .subscribe(() => {
          this.value = this.oldValue + Math.floor((Date.now() - this.start) / 1000);
          this.changeDetectorRef.markForCheck()
        });
    } else {
      this.value = this.oldValue + Math.floor((Date.now() - this.start) / 1000);
      this.oldValue = this.value;
    }
  }

  reset() {
    this.running = false;
    this.start = null;
    this.value = 0;
    this.oldValue = 0;
  }

  apply() {
    this.timerValue.emit(this.value);
  }
}
