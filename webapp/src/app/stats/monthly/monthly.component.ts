import {Component, OnInit} from '@angular/core';
import {StatsService} from "../stats.service";
import {RunsService} from "../../runs/state/runs.service";

@Component({
  selector: 'app-monthly',
  templateUrl: './monthly.component.html',
  styleUrls: ['./monthly.component.scss']
})
export class MonthlyComponent implements OnInit {

  constructor(
    private runsService: RunsService,
    public statsService: StatsService
  ) {
  }

  ngOnInit(): void {
    this.runsService.load();
  }

}
