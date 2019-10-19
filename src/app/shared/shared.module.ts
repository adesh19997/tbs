import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FieldComponent } from './field/field.component';
import { MatInputModule, MatSelectModule, MatCheckboxModule, MatRadioModule, MatIconModule, MatDialogModule, MatButtonModule, MatDatepickerModule, MatMenuModule } from '@angular/material';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { ReactiveFormsModule } from '@angular/forms';
@NgModule({
  imports: [
    CommonModule,
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
    ReactiveFormsModule
  ],
  declarations: [FieldComponent,],
  exports: [
    FieldComponent
  ],
})
export class SharedModule { }
