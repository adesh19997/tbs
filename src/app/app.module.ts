import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { SellingComponent } from './selling/selling.component';

import { environment } from '../environments/environment';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireStorageModule } from 'angularfire2/storage';
import { AuthenticateService } from './services/authenticate.service';
import { DataService } from './services/data.service';
import { StorageService } from './services/storage.service';
import { ConfigService } from './services/config.service';
import {MatListModule} from '@angular/material/list';
import { MatInputModule, MatSelectModule, MatCheckboxModule, MatRadioModule, MatIconModule, MatDialogModule, MatButtonModule, MatDatepickerModule,MatMenuModule, MatProgressBarModule } from '@angular/material';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { ReactiveFormsModule } from '@angular/forms';
import { ProductComponent } from './product/product.component';
import {MatGridListModule} from '@angular/material/grid-list';
import { FieldComponent } from './field/field.component';
import { InventoryComponent } from './inventory/inventory.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SellingComponent,
    ProductComponent,
    FieldComponent,
    InventoryComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase, 'angular-auth-firebase'),
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
    BrowserAnimationsModule,
    MatProgressBarModule
  ],
  exports: [
    HeaderComponent,
    ProductComponent,
    FieldComponent
  ],
  providers: [AuthenticateService,DataService,StorageService,ConfigService],
  bootstrap: [AppComponent]
})
export class AppModule { }
