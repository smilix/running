import {Injectable} from '@angular/core';
import {EntityState, EntityStore, StoreConfig} from '@datorama/akita';
import {Run} from './run.model';

export interface TimerState {
  startValue: number | null; // has the value of a started timer, if running
  oldValue: number; // sum of previous started (and stopped) timer values
  currentValue: number; // current value of the timer

}

export interface RunsState extends EntityState<Run> {
  timer: TimerState;
  tryAdd: Partial<Run> | null;
}

function createInitialState(): RunsState {
  return {
    timer: {
      startValue: null,
      currentValue: 0,
      oldValue: 0
    },
    tryAdd: null
  };
}

@Injectable({providedIn: 'root'})
@StoreConfig({
  name: 'runs',
  cache: {
    ttl: 3600000
  }
})
export class RunsStore extends EntityStore<RunsState> {
  constructor() {
    super(createInitialState());
  }

}
