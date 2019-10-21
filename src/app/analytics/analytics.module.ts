import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HighchartsChartComponent } from 'highcharts-angular';
import { AnalyticsRoutingModule } from './analytics-routing.module';
import { AnalyticsComponent } from './analytics.component';

import { DetailsAnalyticsComponent } from './details-analytics/details-analytics.component';
@NgModule({
  imports: [
    CommonModule,
    AnalyticsRoutingModule
  ],
  declarations: [AnalyticsComponent,HighchartsChartComponent,
    DetailsAnalyticsComponent]
})
export class AnalyticsModule { }
