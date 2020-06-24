import {Injectable} from '@angular/core';
import {Run} from "../runs/state/run.model";
import {serverToClientTime} from "../shared/utils";
import {RunsQuery} from "../runs/state/runs.query";
import {filter, map, switchMap} from "rxjs/operators";
import {DatePipe} from "@angular/common";

export interface Stat {
  dateLabel: string
  totalLength: number;
  totalTimeUsed: number;
}

export interface AllStats {
  week: Stat[];
  month: Stat[];
  year: Stat[];
}

@Injectable({
  providedIn: 'root'
})
export class StatsService {

  private allRunsLoaded$ = this.runsQuery.whenLoaded$.pipe(
    switchMap(() => this.runsQuery.selectAll()));

  readonly allStats$ = this.allRunsLoaded$.pipe(
    map(runs => ({
      week: this.makeWeeklyStats(runs),
      month: this.makeMonthlyStats(runs),
      year: this.makeYearlyStats(runs),
    }))
  );

  readonly monthly$ = this.allRunsLoaded$.pipe(
    map(runs => {
      const oldestRunDate = new Date(serverToClientTime(runs[runs.length - 1].date));
      const now = new Date();
      const months = (now.getFullYear() * 12 + now.getMonth()) - (oldestRunDate.getFullYear() * 12 + oldestRunDate.getMonth());
      return this.makeMonthlyStats(runs, months);
    })
  );


  constructor(
    private datePipe: DatePipe,
    private runsQuery: RunsQuery
  ) {
  }


  makeWeeklyStats(runs: Run[], limit = 6) {
    const WEEK_IN_MS = 7 * 24 * 60 * 60 * 1000;
    const WEEK_FORMAT = 'dd.MM.y';
    // 1: Monday
    const WEEK_BEGIN = 1;

    return this.makeIntervalStats(runs, limit,
      (date) => {
        let weekDay = (date.getDay() - WEEK_BEGIN + 7) % 7;
        let newDay = date.getDate() - weekDay;
        return new Date(date.getFullYear(), date.getMonth(), newDay);
      },
      (date) => {
        return new Date(date.getTime() - WEEK_IN_MS);
      },
      (date) => {
        let weekEnd = new Date(date.getTime() + WEEK_IN_MS);
        return this.datePipe.transform(date, WEEK_FORMAT) +
          ' - ' + this.datePipe.transform(weekEnd, WEEK_FORMAT);
      }
    );
  }

  makeMonthlyStats(runs: Run[], limit = 6) {
    return this.makeIntervalStats(runs, limit,
      (date) => {
        return new Date(date.getFullYear(), date.getMonth(), 1);
      },
      (date) => {
        return new Date(date.getFullYear(), date.getMonth() - 1, 1);
      },
      (date) => {
        return this.datePipe.transform(date, 'MMMM');
      }
    );
  }

  makeYearlyStats(runs: Run[]) {
    if (runs.length === 0) {
      return [];
    }
    let lastEntry = runs[runs.length - 1];
    let yearDelta = new Date().getFullYear() - new Date(serverToClientTime(lastEntry.date)).getFullYear();
    return this.makeIntervalStats(runs, yearDelta + 1,
      (date) => {
        return new Date(date.getFullYear(), 0, 1);
      },
      (date) => {
        return new Date(date.getFullYear() - 1, 0, 1);
      },
      (date) => {
        return this.datePipe.transform(date, 'y');
      }
    );
  }

  private makeIntervalStats(runs: Run[], entries: number,
                            getStartInterval: (d: Date) => Date,
                            getNextInterval: (d: Date) => Date,
                            getStatLabel: (d: Date) => string): Stat[] {
    let stats: Stat[] = [];

    let startDate = getStartInterval(new Date());
    let runIndex = 0;
    for (let intervalCounter = 0; intervalCounter < entries; intervalCounter++) {

      let totalLength = 0;
      let totalTimeUsed = 0;
      for (; runIndex < runs.length; runIndex++) {
        let run = runs[runIndex];
        if (run.date * 1000 < startDate.getTime()) {
          break;
        }

        totalLength += run.length;
        totalTimeUsed += run.timeUsed;
      }

      stats.push({
        dateLabel: getStatLabel(startDate),
        totalLength,
        totalTimeUsed
      });

      startDate = getNextInterval(startDate)
    }

    return stats;
  }
}
