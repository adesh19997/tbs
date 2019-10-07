import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: "/products", pathMatch: 'full' },
  { path: 'products', loadChildren: './selling/selling.module#SellingModule', data: { title: 'Products' } },
  { path: 'inventory', loadChildren: './inventory/inventory.module#InventoryModule', data: { title: 'Inventory' } },
  { path: 'orders', loadChildren: './order/order.module#OrderModule', data: { title: 'Orders' } }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
