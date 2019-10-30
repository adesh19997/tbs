import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { CompanyInfoComponent } from './company-info/company-info.component';
const routes: Routes = [
  { path: '', redirectTo: "/products", pathMatch: 'full' },
  { path: 'products', loadChildren: './selling/selling.module#SellingModule', data: { title: 'Products' } },
  { path: 'login', component: LoginComponent, data: { title: 'SignIn' } },
  { path: 'about-us', component: CompanyInfoComponent, data: { title: 'About Us' } },
  { path: 'inventory', loadChildren: './inventory/inventory.module#InventoryModule', data: { title: 'Inventory' } },
  { path: 'orders', loadChildren: './order/order.module#OrderModule', data: { title: 'Orders' } },
  { path: 'dashboard', loadChildren: './analytics/analytics.module#AnalyticsModule', data: { title: 'Orders' } }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
