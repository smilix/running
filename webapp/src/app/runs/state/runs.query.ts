import {Injectable} from '@angular/core';
import {Order, QueryEntity} from '@datorama/akita';
import {RunsState, RunsStore, TimerState} from './runs.store';
import {Observable} from "rxjs";
import {Run} from "./run.model";
import {filter, map, take} from "rxjs/operators";


@Injectable({providedIn: 'root'})
export class RunsQuery extends QueryEntity<RunsState> {

  // completes when the store is loaded
  readonly whenLoaded$: Observable<any> = this.selectLoading().pipe(
    filter(l => !l),
    take(1));

  readonly latestRun$: Observable<Run> = this.selectAll().pipe(
    map(allRuns => this.findLatest(allRuns)));

  readonly allRunsSorted$: Observable<Run[]> = this.selectAll({
    sortBy: 'date',
    sortByOrder: Order.DESC,
  });

  readonly timerValue$: Observable<number> = this.select(s => s.timer.currentValue);

  constructor(protected store: RunsStore) {
    super(store);
  }

  getTimerState(): TimerState {
    return this.getValue().timer;
  }

  getLatestRun(): Run {
    return this.findLatest(this.getAll());
  }

  selectLastRunsForShoe(shoeId: number): Observable<Run[]> {
    return this.selectAll({
      filterBy: [
        entity => entity.shoeId === shoeId
      ],
      sortBy: 'date',
      sortByOrder: Order.DESC,
      limitTo: 10
    });
  }

  private findLatest(allRuns: Run[]): Run {
    return allRuns.reduce((prev, current) => {
      if (!prev) {
        return current;
      }
      return prev.id > current.id ? prev : current;
    }, null)
  }

}
