import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {DatePipe} from "@angular/common";
import {RunsQuery} from "../../runs/state/runs.query";
import {RunsService} from "../../runs/state/runs.service";
import {ShoesQuery} from "../state/shoes.query";
import {ShoesService} from "../state/shoes.service";
import {finalize, switchMap} from "rxjs/operators";
import {clientToServerTime, serverToClientTime} from "../../shared/utils";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";

@UntilDestroy()
@Component({
  selector: 'app-edit-shoe',
  templateUrl: './edit-shoe.component.html',
  styleUrls: ['./edit-shoe.component.scss']
})
export class EditShoeComponent implements OnInit {

  editForm: FormGroup = this.formBuilder.group({
    bought: [0, Validators.required],
    comment: "",
  });
  newMode = false;

  private currentShoeId: number | null = null;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,
    public shoesQuery: ShoesQuery,
    private shoeService: ShoesService,
  ) {
  }

  ngOnInit(): void {
    this.shoeService.load();

    this.shoesQuery.whenLoaded$.pipe(
      untilDestroyed(this),
      switchMap(() => this.activatedRoute.paramMap)
    ).subscribe(params => {
      this.newMode = params.get('id') === '-';

      let bought = Date.now();
      let comment = '';
      if (!this.newMode) {
        this.currentShoeId = parseInt(params.get('id'), 10);
        const shoe = this.shoesQuery.getEntity(this.currentShoeId);
        bought = serverToClientTime(shoe.bought);
        comment = shoe.comment;
      }

      // example: 2016-07-05T16:47
      const dateStr = this.datePipe.transform(bought, 'yyyy-MM-ddTHH:mm');

      this.editForm.setValue({
        bought: dateStr,
        comment: comment,
      });

      this.editForm.updateValueAndValidity();

    });
  }

  onSubmit(data: any) {
    const show = {
      bought: clientToServerTime(new Date(data.bought)).getTime(),
      comment: data.comment,
    };

    this.editForm.disable();

    if (this.newMode) {
      console.log('Add new shoe:', data);
      this.shoeService.add(show).pipe(
        finalize(() => this.editForm.enable())
      ).subscribe(() => this.router.navigate(['/shoes']))
    } else {
      console.log('Update shoe:', data);
      this.shoeService.update(this.currentShoeId, show).pipe(
        finalize(() => this.editForm.enable())
      ).subscribe();
    }
  }

  back() {
    history.back();
  }
}
