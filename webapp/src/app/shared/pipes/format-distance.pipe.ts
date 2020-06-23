import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'formatDistance'
})
export class FormatDistancePipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    if (typeof value != 'number' || isNaN(value)) {
      return '-';
    }

    let m100 = Math.round(value / 100);
    let km = Math.floor(m100 / 10);
    let partial = m100 % 10;

    if (partial === 0) {
      return '' + km;
    }
    return km + ',' + partial;
  }

}
