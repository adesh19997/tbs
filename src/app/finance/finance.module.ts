import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FinanceRoutingModule } from './finance-routing.module';
import { FinanceComponent } from './finance.component';
import { HighchartsChartModule } from 'highcharts-angular';
import { FormsModule } from '@angular/forms';
import {NativeDateModule} from '@angular/material';
import { MatInputModule,MatNativeDateModule, MatSelectModule, MatRadioModule,MatDialogModule, MatButtonModule, MatDatepickerModule } from '@angular/material';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { ReactiveFormsModule } from '@angular/forms';
import {SharedModule} from '../shared/shared.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  imports: [
    CommonModule,
    FinanceRoutingModule,
    MatInputModule,
    MatDialogModule,
    MatSelectModule,
    MatButtonModule,
    MatRadioModule,
    MatDatepickerModule,
    NgxMatSelectSearchModule,
    ReactiveFormsModule,
    NativeDateModule,
    MatNativeDateModule,
    FormsModule,
    SharedModule,
    HighchartsChartModule,
    NgbModule.forRoot()
  ],
  declarations: [FinanceComponent]
})
export class FinanceModule { }
