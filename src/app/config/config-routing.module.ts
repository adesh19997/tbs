import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ConfigComponent } from './config.component';
import { MasterUploadComponent } from './master-upload/master-upload.component';
import { ScreenConfigComponent } from './screen-config/screen-config.component';

const routes: Routes = [
  { path: '', component: ConfigComponent, data: { title: 'System-Admin' } },
  { path: 'config', component: ConfigComponent, data: { title: 'Inventory' } },
  { path: 'masters', component: MasterUploadComponent, data: { title: 'Master' } },
  { path: 'screens', component: ScreenConfigComponent, data: { title: 'Screen-Config' } }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConfigRoutingModule { }
