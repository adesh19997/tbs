import { Component, OnInit } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { DatePipe } from '@angular/common';
import { DataService } from '../../services/data.service';
import { ConfigService } from '../../services/config.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
@Component({
  selector: 'app-my-order',
  templateUrl: './my-order.component.html',
  styleUrls: ['./my-order.component.scss'],
  providers: [CurrencyPipe, DatePipe]
})
export class MyOrderComponent implements OnInit {
  orders: any = [];
  selectedTrack: any = -1;
  firstFormGroup: FormGroup;
  constructor(
    public data: DataService,
    private config: ConfigService,
    private _formBuilder: FormBuilder
  ) { 
    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.getMyOrders();
  }
  getMyOrders() {
    this.orders = this.data.AllOrders.filter(obj => obj.sCustomerId == this.data.Users.sPhoneNumber);
  }
  track(ind) {
    if (this.selectedTrack != ind) {
      this.selectedTrack = ind;
    } else {
      this.selectedTrack = -1;
    }
  }
}
