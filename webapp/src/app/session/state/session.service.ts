import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {catchError, map, mapTo, tap} from 'rxjs/operators';
import {createInitialState, SessionStore} from './session.store';
import {environment} from "../../../environments/environment";
import {Observable, of} from "rxjs";
import {SessionQuery} from "./session.query";
import {JwtHelperService} from "@auth0/angular-jwt";

export const ERR_INVALID_CREDENTIALS = 'Invalid credentials';

export interface Credentials {
  username: string;
  password: string;
  remember: boolean;
}

interface AuthResponse {
  result: string;
  session: string;
}

@Injectable({providedIn: 'root'})
export class SessionService {

  private jwtHelper = new JwtHelperService();

  constructor(private sessionStore: SessionStore,
              private sessionQuery: SessionQuery,
              private http: HttpClient) {
  }

  // TODO: check the session on startup


  ensureSession(): Observable<boolean> {
    const store = this.sessionStore.getValue();
    if (store.session) {
      if (!this.jwtHelper.isTokenExpired(store.session)) {
        return of(true);
      }

      console.log('Clear the session, because the token is expired.');
      this.sessionStore.update({
        session: null
      });
    }

    if (store.savedUser) {
      console.log('Login with saved credentials');
      return this.loginInternal(store.savedUser, store.savedPassword).pipe(
        mapTo(true),
        tap({
          error: err => {
            if (err.reason === ERR_INVALID_CREDENTIALS) {
              console.log('Invalid credentials from saved state.');
              this.sessionStore.update({
                savedUser: null,
                savedPassword: null,
              })
            }
          }
        })
      );
    }

    return of(false);
  }

  // returns a sessionId if it has saved credentials or en empty string otherwise
  handleSessionError(): Observable<string> {
    this.sessionStore.update({
      session: null
    });

    const store = this.sessionStore.getValue();
    if (!store.savedUser) {
      return of('');
    }

    return this.loginInternal(store.savedUser, store.savedPassword).pipe(
      map(() => this.sessionStore.getValue().session),
      catchError(err => {
        if (err.reason === ERR_INVALID_CREDENTIALS) {
          console.log('Invalid credentials from saved state.');
          this.sessionStore.update({
            savedUser: null,
            savedPassword: null,
          })
        }

        return of('');
      })
    );
  }

  login(cred: Credentials): Observable<any> {
    console.log('Login', cred);
    return this.loginInternal(cred.username, cred.password).pipe(
      tap(() => {
        if (cred.remember) {
          this.sessionStore.update({
            savedUser: cred.username,
            savedPassword: cred.password,
          })
        }
      })
    );
  }

  logout() {
    this.sessionStore.update(createInitialState());
  }

  private loginInternal(user: string, password: string): Observable<AuthResponse> {
    console.log('Login internal');
    return this.http.post<AuthResponse>(environment.backendPath + '/auth', {
      user: user,
      password: password,
    }).pipe(
      tap(data =>
        this.sessionStore.update({
          session: data.session
        }))
    )
  }

}
