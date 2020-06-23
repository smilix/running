import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {SessionQuery} from "./state/session.query";
import {catchError, switchMap} from "rxjs/operators";
import {SessionService} from "./state/session.service";
import {environment} from "../../environments/environment";
import {Router} from "@angular/router";

@Injectable()
export class HttpSessionInterceptor implements HttpInterceptor {

  private readonly LOGIN_URL = environment.backendPath + '/auth';

  constructor(private sessionQuery: SessionQuery,
              private sessionService: SessionService,
              private router: Router) {
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (!request.url.startsWith(environment.backendPath) || request.url === this.LOGIN_URL) {
      return next.handle(request);
    }

    return this.sessionService.ensureSession().pipe(
      switchMap(hasSession => {
        if (hasSession) {
          // console.log('Setting session to request');
          request = request.clone({
            setHeaders: {
              'Session-Id': this.sessionQuery.getValue().session
            }
          });
        }

        return next.handle(request);
      }),
      catchError(err => {
        if (err.status == 401 && err.url.indexOf('/login') !== 0) {
          return this.sessionService.handleSessionError().pipe(
            switchMap((session) => {
              if (session !== '') {
                console.log('try again with', session);
                request = request.clone({
                  setHeaders: {
                    'Session-Id': session
                  }
                });
                return next.handle(request);
              }

              console.log('got no new session, forward the error and goto login');
              this.router.navigate(['/login', {route: this.router.url}]);
              return throwError(err);
            }))
        }

        return throwError(err);
      }));


  }
}
