import {Injectable} from '@angular/core';
import {EntityState, EntityStore, StoreConfig} from '@datorama/akita';
import {Run} from './run.model';

export interface RunsState extends EntityState<Run> {
  tryAdd: Partial<Run> | null
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
    super();
  }

}
