import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProductComponent } from './product/product.component';
import { ViewProductComponent } from './view-product/view-product.component';
import { CartComponent } from './cart/cart.component';
import { MyOrderComponent } from './my-order/my-order.component'
import { MyDetailsComponent } from './my-details/my-details.component';
import { BuyComponent } from './buy/buy.component';

const routes: Routes = [
  { path: '', component: ProductComponent, data: { title: 'Products' } },
  { path: 'view', component: ViewProductComponent, data: { title: 'View' } },
  { path: 'cart', component: CartComponent, data: { title: 'My Cart' } },
  { path: 'orders', component: MyOrderComponent, data: { title: 'My Orders' } },
  { path: 'details', component: MyDetailsComponent, data: { title: 'My Details' } },
  { path: 'buy', component: BuyComponent, data: { title: 'Purchase' } }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SellingRoutingModule { }
