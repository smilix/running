import { TestBed } from '@angular/core/testing';

import { HttpSessionInterceptor } from './http-session.interceptor';

describe('HttpSessionInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      HttpSessionInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: HttpSessionInterceptor = TestBed.inject(HttpSessionInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
