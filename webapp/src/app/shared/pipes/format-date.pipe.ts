import {Pipe, PipeTransform} from '@angular/core';
import {DatePipe} from "@angular/common";

@Pipe({
  name: 'formatDate'
})
export class FormatDatePipe implements PipeTransform {

  constructor(private datePipe: DatePipe) {
  }

  // expects unix timestamp in seconds
  transform(value: unknown, formatOption?: string): unknown {
    if (typeof value != 'number' || isNaN(value)) {
      return '-';
    }

    const format = formatOption === 'notime' ? 'dd.MM.y' : 'dd.MM.y HH:mm';

    return this.datePipe.transform(value * 1000, format);
  }
}
