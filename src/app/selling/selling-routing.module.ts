import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ProductComponent } from './product/product.component';
import {ViewProductComponent } from './view-product/view-product.component';
import { CartComponent } from './cart/cart.component';
import { MyOrderComponent } from './my-order/my-order.component'
import { MyDetailsComponent } from './my-details/my-details.component';

const routes: Routes = [
  { path: '', component: ProductComponent,  data: { title: 'Products' } },
  { path: 'products', component: ProductComponent, data: { title: 'Products' } },
  { path: 'view', component: ViewProductComponent, data: { title: 'View' } },
  { path: 'cart', component: CartComponent, data: { title: 'Cart' } },
  { path: 'orders', component: MyOrderComponent, data: { title: 'Orders' } },
  { path: 'cart', component: CartComponent, data: { title: 'Cart' } },
  { path: 'details', component: MyDetailsComponent, data: { title: 'Details' } }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SellingRoutingModule { }
