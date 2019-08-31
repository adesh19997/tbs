import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SellingComponent } from './selling/selling.component';
const routes: Routes = [
  { path: '', redirectTo:"/products", pathMatch: 'full' },
  { path: 'products', component:SellingComponent, data: { title: 'products' }}
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{ useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
