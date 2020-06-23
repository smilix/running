import {Injectable} from '@angular/core';
import {Store, StoreConfig} from '@datorama/akita';

export interface SessionState {
  session: string;
  savedUser: string | null;
  savedPassword: string | null;
}

export function createInitialState(): SessionState {
  return {
    session: '',
    savedUser: null,
    savedPassword: null,
  };
}

@Injectable({providedIn: 'root'})
@StoreConfig({name: 'session'})
export class SessionStore extends Store<SessionState> {

  constructor() {
    super(createInitialState());
  }

}
