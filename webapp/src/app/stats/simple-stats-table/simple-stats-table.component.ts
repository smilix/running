import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {Stat} from "../stats.service";

@Component({
  selector: 'app-simple-stats-table',
  templateUrl: './simple-stats-table.component.html',
  styleUrls: ['./simple-stats-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SimpleStatsTableComponent implements OnInit {

  readonly displayedColumns = ['date', 'length', 'timeUsed', 'timePerKm'];

  @Input()
  dataSource: Stat[];


  constructor() {
  }

  ngOnInit(): void {
  }

}
