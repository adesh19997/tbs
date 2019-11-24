import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {FinanceComponent } from './finance.component';
const routes: Routes = [
  { path: '', component: FinanceComponent, data: { title: 'Finances' } },
  { path: 'finance', component: FinanceComponent, data: { title: 'Finances' } }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FinanceRoutingModule { }
