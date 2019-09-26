import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: "/buy", pathMatch: 'full' },
  { path: 'buy', loadChildren: './selling/selling.module#SellingModule', data: { title: 'Products' } },
  { path: 'inventory', loadChildren: './inventory/inventory.module#InventoryModule', data: { title: 'Inventory' } }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
