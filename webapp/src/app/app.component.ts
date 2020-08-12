import {Component, ViewChild} from '@angular/core';
import {MediaMatcher} from "@angular/cdk/layout";
import {SessionQuery} from "./session/state/session.query";
import {SessionService} from "./session/state/session.service";
import {Router} from "@angular/router";
import {versionInfo} from "../environments/version";
import {MatSidenav} from "@angular/material/sidenav";

// ordered by: the most specific first
const routes = [
  'runs/edit/-',
  'stats/overview',
  'runs',
  'shoes',
];

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  readonly version = versionInfo;

  mobileQuery: MediaQueryList;

  @ViewChild('snav')
  private snav: MatSidenav;

  constructor(media: MediaMatcher,
              public sessionQuery: SessionQuery,
              private sessionService: SessionService,
              private router: Router,
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
  }

  logout() {
    this.sessionService.logout();
    this.router.navigate(['login'])
  }

  checkClose() {
    if (this.mobileQuery.matches) {
      this.snav.close();
    }
  }

  swipeLeft() {
    this.gotoNextSwipeableRoute(-1);
  }

  swipeRight() {
    this.gotoNextSwipeableRoute(1);
  }

  private gotoNextSwipeableRoute(direction: number): number {
    const index = routes.findIndex(r => {
      return this.router.isActive(r, false);
    });
    if (index === -1) {
      return;
    }
    const newIndex = (index + direction + routes.length) % routes.length;
    const newRoute = routes[newIndex];
    console.log('Swipe: Goto', newRoute);
    this.router.navigate([newRoute]);
  }
}
