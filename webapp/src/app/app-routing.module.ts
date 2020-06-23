import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from "./session/login/login.component";
import {SessionGuard} from "./session/session.guard";
import {ListRunsComponent} from "./runs/list-runs/list-runs.component";
import {EditRunComponent} from "./runs/edit-run/edit-run.component";
import {ListShoesComponent} from "./shoes/list-shoes/list-shoes.component";
import {EditShoeComponent} from "./shoes/edit-shoe/edit-shoe.component";
import {OverviewComponent} from "./stats/overview/overview.component";
import {MonthlyComponent} from "./stats/monthly/monthly.component";


const routes: Routes = [
  {
    path: '', canActivate: [SessionGuard], children: [
      {path: 'stats/overview', component: OverviewComponent},
      {path: 'stats/monthly', component: MonthlyComponent},
      {path: 'runs', component: ListRunsComponent},
      {path: 'runs/edit/:id', component: EditRunComponent},
      {path: 'shoes', component: ListShoesComponent},
      {path: 'shoes/edit/:id', component: EditShoeComponent},
      {path: '', pathMatch: 'full', redirectTo: 'stats/overview'}
    ]
  },
  {path: 'login', component: LoginComponent},
  {path: '**', redirectTo: 'stats/overview'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
