import {Injectable} from '@angular/core';
import {Query} from '@datorama/akita';
import {SessionStore, SessionState} from './session.store';
import {Observable} from "rxjs";

@Injectable({providedIn: 'root'})
export class SessionQuery extends Query<SessionState> {

  readonly hasSession$: Observable<boolean> = this.select(d => !!d.session);

  constructor(protected store: SessionStore) {
    super(store);
  }

}
