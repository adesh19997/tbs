import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SellingRoutingModule } from './selling-routing.module';
import { MyOrderComponent } from './my-order/my-order.component';
import { MyDetailsComponent } from './my-details/my-details.component';
import { ProductComponent } from './product/product.component';
import { ViewProductComponent } from './view-product/view-product.component';
import { CartComponent } from './cart/cart.component';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireStorageModule } from 'angularfire2/storage';
import { MatListModule } from '@angular/material/list';
import { MatInputModule, MatSelectModule, MatCheckboxModule, MatRadioModule, MatIconModule, MatDialogModule, MatButtonModule, MatDatepickerModule, MatMenuModule, MatProgressBarModule } from '@angular/material';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { ReactiveFormsModule } from '@angular/forms';
import { MatGridListModule } from '@angular/material/grid-list';
import { StarRatingModule } from 'angular-star-rating';
import { SharedModule } from '../shared/shared.module';
@NgModule({
  declarations: [
    ViewProductComponent,
    CartComponent,
    ProductComponent,
    MyOrderComponent,
    MyDetailsComponent
  ],
  imports: [
    CommonModule,
    SellingRoutingModule,
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
    StarRatingModule,
    SharedModule
  ]
})
export class SellingModule { }
