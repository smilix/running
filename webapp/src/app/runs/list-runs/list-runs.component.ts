import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {RunsQuery} from "../state/runs.query";
import {RunsService} from "../state/runs.service";
import {MatPaginator} from "@angular/material/paginator";
import {MatTableDataSource} from "@angular/material/table";
import {Run} from "../state/run.model";
import {ConfirmService} from "../../shared/confirm/confirm.component";
import {animate, state, style, transition, trigger} from "@angular/animations";
import {ShoesQuery} from "../../shoes/state/shoes.query";
import {ShoesService} from "../../shoes/state/shoes.service";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";
import {filter, switchMap} from "rxjs/operators";

@UntilDestroy()
@Component({
  selector: 'app-list-runs',
  templateUrl: './list-runs.component.html',
  styleUrls: ['./list-runs.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListRunsComponent implements OnInit {

  displayedColumns: string[] = ['date', 'length', 'timeUsed', 'timePerKm'];
  dataSource: MatTableDataSource<Run>;

  expandedElement: any;
  disabled = false;

  @ViewChild(MatPaginator, {static: true})
  private paginator: MatPaginator;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    public runsQuery: RunsQuery,
    private runsService: RunsService,
    public shoesQuery: ShoesQuery,
    private shoeService: ShoesService,
    private confirmService: ConfirmService,
  ) {
  }

  ngOnInit(): void {
    this.runsService.load();
    this.shoeService.load();

    this.runsQuery.whenLoaded$.pipe(
      untilDestroyed(this),
      switchMap(() => this.runsQuery.allRunsSorted$),
    ).subscribe(runs => {
      if (this.dataSource) {
        this.dataSource.data = runs;
      } else {
        this.dataSource = new MatTableDataSource<Run>(runs);
        this.dataSource.paginator = this.paginator;
      }
    });
  }

  delete(runId: number) {
    this.confirmService.confirmDeletion('Delete this run?').pipe(
      untilDestroyed(this)
    ).subscribe(result => {
      if (result) {
        this.disabled = true;
        this.changeDetectorRef.markForCheck();
        this.runsService.remove(runId).subscribe(() => {

          this.changeDetectorRef.markForCheck();
        })
      }
    });
  }

  back() {
    window.history.back();
  }
}

