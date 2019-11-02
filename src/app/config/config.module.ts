import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ConfigRoutingModule } from './config-routing.module';
import { ConfigComponent } from './config.component';
import { MasterUploadComponent } from './master-upload/master-upload.component';
import { ScreenConfigComponent } from './screen-config/screen-config.component';

import { FormsModule } from '@angular/forms';
import {NativeDateModule} from '@angular/material';
import { MatInputModule,MatNativeDateModule, MatSelectModule, MatCheckboxModule,MatRadioModule, MatIconModule, MatDialogModule, MatButtonModule, MatDatepickerModule,MatMenuModule, MatProgressBarModule } from '@angular/material';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { ReactiveFormsModule } from '@angular/forms';
import {SharedModule} from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    ConfigRoutingModule,
    MatInputModule,
    MatDialogModule,
    MatSelectModule,
    MatButtonModule,
    MatRadioModule,
    MatIconModule,
    MatCheckboxModule,
    MatDatepickerModule,
    NgxMatSelectSearchModule,
    MatMenuModule,
    ReactiveFormsModule,
    MatProgressBarModule,
    NativeDateModule,
    MatNativeDateModule,
    FormsModule,
    SharedModule,
    NgbModule.forRoot()
  ],
  declarations: [ConfigComponent, MasterUploadComponent, ScreenConfigComponent]
})
export class ConfigModule { }
