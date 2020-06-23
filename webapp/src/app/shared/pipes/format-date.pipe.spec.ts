import {FormatDatePipe} from './format-date.pipe';
import {TestBed} from "@angular/core/testing";
import {CommonModule, DatePipe} from "@angular/common";

describe('FormatDatePipe', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FormatDatePipe, DatePipe]
    });
  });

  it('test formatting', () => {
    const pipe = TestBed.inject(FormatDatePipe);
    expect(pipe).toBeTruthy();
    expect(pipe.transform(1590758350)).toBe('29.05.2020 15:19');
    expect(pipe.transform(undefined)).toBe('-');
  });
});
