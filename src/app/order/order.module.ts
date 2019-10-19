import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { OrderRoutingModule } from './order-routing.module';
import { OrderComponent } from './order.component';
import {SharedModule} from '../shared/shared.module';
import { FormsModule } from '@angular/forms';
import { MatInputModule, MatSelectModule,MatButtonModule,MatRadioModule } from '@angular/material';
import { ReactiveFormsModule } from '@angular/forms';
@NgModule({
  imports: [
    CommonModule,
    OrderRoutingModule,
    SharedModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatRadioModule,
    FormsModule,
    NgbModule.forRoot(),
  ],
  declarations: [OrderComponent]
})
export class OrderModule { }
