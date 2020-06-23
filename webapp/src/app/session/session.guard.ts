import { Injectable } from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router} from '@angular/router';
import { Observable } from 'rxjs';
import {SessionQuery} from "./state/session.query";
import {SessionService} from "./state/session.service";
import {map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class SessionGuard implements CanActivate {

  constructor(private sessionService: SessionService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    console.log('SessionGuard:ensureSession');
    return this.sessionService.ensureSession().pipe(
      map(hasSession => {
        if (hasSession) {
          return true;
        }

        console.log('No session -> Login');
        return this.router.createUrlTree(['login']);
      }));
  }
}
