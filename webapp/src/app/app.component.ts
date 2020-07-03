import {Component} from '@angular/core';
import {MediaMatcher} from "@angular/cdk/layout";
import {SessionQuery} from "./session/state/session.query";
import {SessionService} from "./session/state/session.service";
import {Router} from "@angular/router";
import {versionInfo} from "../environments/version";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  readonly version = versionInfo;

  mobileQuery: MediaQueryList;

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
}
