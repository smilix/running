import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListShoesComponent } from './list-shoes/list-shoes.component';
import {MatTableModule} from "@angular/material/table";
import {MatButtonModule} from "@angular/material/button";
import {RouterModule} from "@angular/router";
import {SharedModule} from "../shared/shared.module";
import {MatIconModule} from "@angular/material/icon";
import { EditShoeComponent } from './edit-shoe/edit-shoe.component';
import {MatCardModule} from "@angular/material/card";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {ReactiveFormsModule} from "@angular/forms";



@NgModule({
  declarations: [ListShoesComponent, EditShoeComponent],
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    RouterModule,
    SharedModule,
    MatIconModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule
  ]
})
export class ShoesModule { }
