import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {UntilDestroy} from "@ngneat/until-destroy";
import {RunsService} from "../../runs/state/runs.service";
import {StatsService} from "../stats.service";


@UntilDestroy()
@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OverviewComponent implements OnInit {

  constructor(
    private runsService: RunsService,
    // public shoesQuery: ShoesQuery,
    // private shoeService: ShoesService,
    public statsService: StatsService,
  ) {
  }

  ngOnInit(): void {
    this.runsService.load();
    // this.shoeService.load();

  }

}
