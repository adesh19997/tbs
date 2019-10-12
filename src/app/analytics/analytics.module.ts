import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AnalyticsRoutingModule } from './analytics-routing.module';
import { AnalyticsComponent } from './analytics.component';

import { DetailsAnalyticsComponent } from './details-analytics/details-analytics.component';
@NgModule({
  imports: [
    CommonModule,
    AnalyticsRoutingModule
  ],
  declarations: [AnalyticsComponent,
    DetailsAnalyticsComponent]
})
export class AnalyticsModule { }
