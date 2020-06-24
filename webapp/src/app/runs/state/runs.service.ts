import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {cacheable} from '@datorama/akita';
import {map, tap} from 'rxjs/operators';
import {Run} from './run.model';
import {RunsStore} from './runs.store';
import {environment} from "../../../environments/environment";
import {Observable, throwError} from "rxjs";
import {ErrorDialogService} from "../../shared/error-dialog/error-dialog.component";
import {ApiResponse} from "../../shared/api";

interface RunsResponse extends ApiResponse {
  count: number;
  runs: Run[];
}

interface RunAddResponse extends ApiResponse {
  id: number;
}

const WEEK_IN_MS = 7 * 24 * 60 * 60 * 1000;

@Injectable({providedIn: 'root'})
export class RunsService {

  constructor(
    private runsStore: RunsStore,
    private http: HttpClient,
    private errorDialog: ErrorDialogService) {

    // reset to 'false' (it was true because of the cached 'tryAdd' value)
    runsStore.setHasCache(false);
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

  clearTryAdd() {
    this.runsStore.update({
      tryAdd: null
    });
  }

  add(run: Omit<Run, 'id'>): Observable<Run> {
    this.runsStore.update({
      tryAdd: run
    });
    return throwError('foo');
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
