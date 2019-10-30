import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { DatePipe } from '@angular/common';
import { AppComponent } from './app.component';
import { environment } from '../environments/environment';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireStorageModule } from 'angularfire2/storage';
import { AuthenticateService } from './services/authenticate.service';
import { DataService } from './services/data.service';
import { StorageService } from './services/storage.service';
import { ConfigService } from './services/config.service';
import { MatListModule } from '@angular/material/list';
import { MatInputModule, MatSelectModule, MatCheckboxModule, MatRadioModule, MatIconModule, MatDialogModule, MatButtonModule, MatDatepickerModule, MatMenuModule, MatProgressBarModule } from '@angular/material';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { ReactiveFormsModule } from '@angular/forms';
import { MatGridListModule } from '@angular/material/grid-list';
import { HttpClientModule } from '@angular/common/http';
import { HeaderComponent } from './header/header.component';
import { LoginComponent } from './login/login.component';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
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
  exports: [HeaderComponent],
  providers: [AuthenticateService, DataService, StorageService, ConfigService,DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
