import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OrderComponent } from './order.component';
const routes: Routes = [
  { path: '', component: OrderComponent, data: { title: 'Orders' } },
  { path: 'orders', component: OrderComponent, data: { title: 'Orders' } }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrderRoutingModule { }
