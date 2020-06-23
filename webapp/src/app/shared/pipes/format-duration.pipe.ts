import {Pipe, PipeTransform} from '@angular/core';
import {formatSeconds} from "../utils";

@Pipe({
  name: 'formatDuration'
})
export class FormatDurationPipe implements PipeTransform {

  transform(seconds: unknown, ...args: unknown[]): unknown {
    if (typeof seconds != 'number' || isNaN(seconds)) {
      return '-';
    }

    return formatSeconds(seconds);
  }

}
