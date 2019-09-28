import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InventoryRoutingModule } from './inventory-routing.module';
import { InventoryComponent } from './/inventory.component';
import { FormsModule } from '@angular/forms';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireStorageModule } from 'angularfire2/storage';
import {MatListModule} from '@angular/material/list';
import { MatInputModule, MatSelectModule, MatCheckboxModule, MatRadioModule, MatIconModule, MatDialogModule, MatButtonModule, MatDatepickerModule,MatMenuModule, MatProgressBarModule } from '@angular/material';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { ReactiveFormsModule } from '@angular/forms';
import {MatGridListModule} from '@angular/material/grid-list';
import {SharedModule} from '../shared/shared.module';
@NgModule({
  imports: [
    CommonModule,
    InventoryRoutingModule,
    AngularFireStorageModule,
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    MatListModule,
    MatInputModule,
    MatDialogModule,
    MatSelectModule,
    MatButtonModule,
    MatListModule,
    MatRadioModule,
    MatIconModule,
    MatCheckboxModule,
    MatDatepickerModule,
    NgxMatSelectSearchModule,
    MatMenuModule,
    ReactiveFormsModule,
    MatGridListModule,
    MatProgressBarModule,
    FormsModule,
    SharedModule
  ],
  declarations: [InventoryComponent],
})
export class InventoryModule { }
