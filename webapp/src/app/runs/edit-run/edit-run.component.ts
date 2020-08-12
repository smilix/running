import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {RunsQuery} from "../state/runs.query";
import {RunsService} from "../state/runs.service";
import {ShoesService} from "../../shoes/state/shoes.service";
import {ShoesQuery} from "../../shoes/state/shoes.query";
import {combineLatest} from "rxjs";
import {DatePipe} from "@angular/common";
import {ActivatedRoute, Router} from "@angular/router";
import {filter, finalize, min, switchMap, take, takeWhile} from "rxjs/operators";
import {clientToServerTime, serverToClientTime} from "../../shared/utils";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";
import {Run} from "../state/run.model";

@UntilDestroy()
@Component({
  selector: 'app-edit-run',
  templateUrl: './edit-run.component.html',
  styleUrls: ['./edit-run.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditRunComponent implements OnInit {

  editForm: FormGroup = this.formBuilder.group({
    when: [0, Validators.required],
    distance: [0, [Validators.required, Validators.min(1)]],
    duration: [0, [Validators.required, Validators.min(1)]],
    comment: "",
    shoeId: [0, Validators.required]
  });
  newMode = false;

  readonly triedAdd$ = this.runsQuery.select(s => s.tryAdd).pipe(
    untilDestroyed(this),
    takeWhile(() => !this.ignoreRestore)
  );

  private currentRunId: number | null = null;
  private ignoreRestore = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private runsQuery: RunsQuery,
    private runsService: RunsService,
    public shoesQuery: ShoesQuery,
    private shoeService: ShoesService,
  ) {
  }

  ngOnInit(): void {
    this.runsService.load();
    this.shoeService.load();

    combineLatest([
      this.runsQuery.selectLoading(),
      this.shoesQuery.selectLoading(),
    ]).pipe(
      untilDestroyed(this),
      filter(([runLoading, shoesLoading]) => !runLoading && !shoesLoading),
      take(1),
      switchMap(() => this.activatedRoute.paramMap)
    ).subscribe(params => {
      // both stores are loaded and we get updates on route params
      this.newMode = params.get('id') === '-';

      let when = Date.now();
      let run;
      if (this.newMode) {
        run = this.runsQuery.getLatestRun();
      } else {
        this.currentRunId = parseInt(params.get('id'), 10);
        run = this.runsQuery.getEntity(this.currentRunId);
        when = serverToClientTime(run.date);
      }

      this.addRunToForm(run, when);

      this.editForm.updateValueAndValidity();
    });
  }

  private addRunToForm(run: Partial<Run>, when: number) {
    let distance = 0;
    let duration = 0;
    let comment = '';
    let shoeId = this.shoesQuery.latestShoe()?.id;

    // example: 2016-07-05T16:47
    const dateStr = this.datePipe.transform(when, 'yyyy-MM-ddTHH:mm');

    if (run) {
      distance = Math.floor(run.length / 1000);
      duration = Math.floor(run.timeUsed / 60);
      comment = run.comment;
      shoeId = run.shoeId;
    }

    this.editForm.setValue({
      when: dateStr,
      distance: distance,
      duration: duration,
      comment: comment,
      shoeId: shoeId,
    });
  }

  onSubmit(data: any) {
    const run = {
      date: clientToServerTime(new Date(data.when)).getTime(),
      length: data.distance * 1000,
      timeUsed: data.duration * 60,
      comment: data.comment,
      shoeId: data.shoeId,
    };

    this.ignoreRestore = true;
    this.editForm.disable();

    if (this.newMode) {
      console.log('Add new run:', data);
      this.runsService.add(run).pipe(
        finalize(() => this.editForm.enable())
      ).subscribe(() => {
        this.runsService.clearTimerState();
        return this.router.navigate(['/runs']);
      })
    } else {
      console.log('Update run:', data);
      this.runsService.update(this.currentRunId, run).pipe(
        finalize(() => this.editForm.enable())
      ).subscribe(() => {
        this.runsService.clearTimerState();
      });
    }

  }

  addToField(fieldName: string, diff: number) {
    const patch = {};
    patch[fieldName] = this.editForm.value[fieldName] + diff;
    this.editForm.patchValue(patch);
  }

  setDuration(value: number) {
    const minuteValue = Math.floor(value / 60);
    this.editForm.patchValue({
      duration: minuteValue
    });
  }

  back() {
    history.back();
  }

  restoreData(tryRun: Partial<Run>) {
    this.addRunToForm(tryRun, serverToClientTime(tryRun.date));
    this.runsService.clearTryAdd();
  }

  discardData() {
    this.runsService.clearTryAdd();
  }
}
