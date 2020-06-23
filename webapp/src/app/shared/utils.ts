import {formatNumber} from "@angular/common";

export function zeroPad(n: number): string {
  let str = n.toString();
  if (str.length < 2) {
    str = '0' + str;
  }
  return str;
}

export function formatSeconds(seconds: number) {
  const minutes = Math.floor(seconds / 60); // 60
  const hours = Math.floor(minutes / 60); // 1
  const days = Math.floor(hours / 24);

  const secondsPart = Math.floor(seconds % 60);
  const minutesPart = Math.floor(minutes % 60);
  const hourPart = Math.floor(hours % 60);
  const dayPart = Math.floor(days % 24);

  let result = '';
  if (dayPart > 0) {
    result += dayPart + 'd ';
  }
  if (hourPart > 0) {
    result += zeroPad(hourPart) + ':';
  }
  if (minutesPart > 0 || hourPart > 0) {
    result += zeroPad(minutesPart) + ':';
  }
  result += zeroPad(secondsPart);

  return result;
}


export function serverToClientTime<T extends number | Date>(time: T): T {
  if (typeof time === "number") {
    return (time * 1000) as T;
  } else {
    return new Date((time as Date).getTime() * 1000) as T;
  }
}

export function clientToServerTime<T extends number | Date>(time: T): T {
  if (typeof time === "number") {
    return Math.floor(time / 1000) as T;
  } else {
    return new Date((time as Date).getTime() / 1000) as T;
  }
}
