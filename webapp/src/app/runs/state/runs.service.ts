import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {cacheable} from '@datorama/akita';
import {map, tap} from 'rxjs/operators';
import {Run} from './run.model';
import {RunsStore, TimerState} from './runs.store';
import {environment} from "../../../environments/environment";
import {Observable} from "rxjs";
import {ErrorDialogService} from "../../shared/error-dialog/error-dialog.component";
import {ApiResponse} from "../../shared/api";

interface RunsResponse extends ApiResponse {
  count: number;
  runs: Run[];
}

interface RunAddResponse extends ApiResponse {
  id: number;
}

@Injectable({providedIn: 'root'})
export class RunsService {

  constructor(
    private runsStore: RunsStore,
    private http: HttpClient,
    private errorDialog: ErrorDialogService) {

    // reset to 'false' (it was true because of the cached 'tryAdd' value)
    runsStore.setHasCache(false);


    // we don't persist the old current value, so we use the old value for it
    const oldValue = this.runsStore.getValue().timer.oldValue;
    if (oldValue > 0) {
      this.runsStore.update(s => ({
        timer: {
          ...s.timer,
          currentValue: oldValue
        }
      }));
    }
  }

  load(): void {
    cacheable(this.runsStore,
      this.http.get<RunsResponse>(environment.backendPath + '/runs').pipe(
        tap(entities => {
          this.runsStore.set(entities.runs);
        }),
        this.errorDialog.catchApiError('Loading runs'),
      ))
      .subscribe()
  }

  updateTimerState(timer: Partial<TimerState>) {
    this.runsStore.update(s => ({
      timer: {
        ...s.timer,
        ...timer
      }
    }));
  }

  clearTimerState() {
    this.updateTimerState({
      startValue: null,
      currentValue: 0,
      oldValue: 0,
    });
  }

  clearTryAdd() {
    this.runsStore.update({tryAdd: null});
  }

  add(run: Omit<Run, 'id'>): Observable<Run> {
    this.runsStore.update({
      tryAdd: run
    });
    return this.http.post<RunAddResponse>(`${environment.backendPath}/runs`, run).pipe(
      map(response => {
        const newRun: Run = {
          ...run,
          id: response.id
        };
        console.log('New run:', newRun);
        this.runsStore.add(newRun);
        this.clearTryAdd();
        return newRun;
      }),
      this.errorDialog.catchApiError('Add run')
    );
  }

  update(id, run: Partial<Run>): Observable<Run> {
    return this.http.put<Run>(`${environment.backendPath}/runs/${id}`, run).pipe(
      tap((updatedRun) => {
        console.log('updated', run, 'to', updatedRun);
        this.runsStore.update(id, updatedRun);
      }),
      this.errorDialog.catchApiError('Update run'),
    );
  }

  remove(id: number): Observable<any> {
    return this.http.delete(`${environment.backendPath}/runs/${id}`).pipe(
      tap(() => {
        this.runsStore.remove(id);
      }),
      this.errorDialog.catchApiError('Remove run'),
    );
  }
}
