import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ShoesQuery} from "../state/shoes.query";
import {ShoesService} from "../state/shoes.service";
import {animate, state, style, transition, trigger} from "@angular/animations";
import {RunsQuery} from "../../runs/state/runs.query";
import {RunsService} from "../../runs/state/runs.service";
import {ConfirmService} from "../../shared/confirm/confirm.component";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";

@UntilDestroy()
@Component({
  selector: 'app-list-shoes',
  templateUrl: './list-shoes.component.html',
  styleUrls: ['./list-shoes.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListShoesComponent implements OnInit {

  displayedColumns: string[] = ['bought', 'comment', 'used', 'totalLength'];
  expandedElement: any;
  disabled = false;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    public shoesQuery: ShoesQuery,
    private shoesService: ShoesService,
    public runsQuery: RunsQuery,
    private runsService: RunsService,
    private confirmService: ConfirmService,
  ) {
  }

  ngOnInit(): void {
    this.shoesService.load();
    this.runsService.load();
  }

  deleteShoe(shoeId: number) {
    this.confirmService.confirmDeletion('Delete this shoe?').pipe(
      untilDestroyed(this)
    ).subscribe(result => {
      if (result) {
        this.disabled = true;
        this.changeDetectorRef.markForCheck();
        this.shoesService.remove(shoeId).subscribe(() => {
        })
      }
    });
  }
}
