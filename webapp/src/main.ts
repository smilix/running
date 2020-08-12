import {enableProdMode} from '@angular/core';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';

import {AppModule} from './app/app.module';
import {environment} from './environments/environment';
import {persistState, PersistStateSelectFn} from "@datorama/akita";
import {RunsState} from "./app/runs/state/runs.store";
import {SessionState} from "./app/session/state/session.store";

if (environment.production) {
  enableProdMode();
}


const runsSelectToken: PersistStateSelectFn<RunsState> = (state) => ({
  tryAdd: state.tryAdd,
  timer: {
    startValue: state.timer.startValue,
    oldValue: state.timer.oldValue,
    currentValue: 0,
  }
});
runsSelectToken.storeName = 'runs';
const sessionSelectToken: PersistStateSelectFn<SessionState> = (s) => (s);
sessionSelectToken.storeName = 'session';

persistState({
  include: ['session', 'runs'],
  select: [sessionSelectToken, runsSelectToken]
});

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
