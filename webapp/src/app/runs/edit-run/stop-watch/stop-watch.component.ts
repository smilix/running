import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {timer} from "rxjs";
import {takeWhile} from "rxjs/operators";
import {RunsService} from "../../state/runs.service";
import {RunsQuery} from "../../state/runs.query";
import {TimerState} from "../../state/runs.store";

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

  running = false;

  constructor(
    private runsService: RunsService,
    public runsQuery: RunsQuery,
  ) {
  }

  ngOnInit(): void {
    const timerState = this.runsQuery.getTimerState();
    if (timerState.startValue) {
      this.running = true;
      this.startTimer();
    }
  }

  ngOnDestroy() {
    this.running = false;
  }

  toggle() {
    this.running = !this.running;

    const now = Date.now();
    const timer = this.runsQuery.getTimerState();
    const update: Partial<TimerState> = {};

    if (this.running) {
      update.startValue = now;
      this.startTimer();
    } else {
      update.currentValue = timer.oldValue + Math.floor((now - timer.startValue) / 1000);
      update.oldValue = timer.currentValue;
      update.startValue = null;
    }

    this.runsService.updateTimerState(update);
  }

  reset() {
    this.running = false;
    this.runsService.clearTimerState();
  }

  apply() {
    this.timerValue.emit(this.runsQuery.getTimerState().currentValue);
  }

  private startTimer() {
    timer(1000, 1000).pipe(
      takeWhile(() => this.running))
      .subscribe(() => {
        const timer = this.runsQuery.getTimerState();
        this.runsService.updateTimerState({
          currentValue: timer.oldValue + Math.floor((Date.now() - timer.startValue) / 1000)
        });
      });
  }
}
