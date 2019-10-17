import { Component, OnInit } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { DataService } from '../../services/data.service';
import { ConfigService } from '../../services/config.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
@Component({
  selector: 'app-buy',
  templateUrl: './buy.component.html',
  styleUrls: ['./buy.component.scss'],
  providers: [CurrencyPipe]
})
export class BuyComponent implements OnInit {
  Order: any = {};
  userData: any = {}
  form: FormGroup;
  basicData: FormGroup;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;
  addrFields: any = [];
  basicFields: any = [];
  constructor(public data: DataService,
    private config: ConfigService,
    private router: Router,
    private _formBuilder: FormBuilder) {
    this.Order = this.data.Order;
    this.userData = this.data.Users;
    this.addrFields = this.config.setAddrFields();
    this.basicFields = this.config.setBasicDatField();
    this.basicData = this.config.geSectionForm(this.data.Users, this.basicFields);
    this.setAddr(0);
  }

  ngOnInit() {
    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required]
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required]
    });
    this.thirdFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required]
    });
    this.calculateTotal()
  }
  buy() {
    this.config.setData(this.addrFields, this.Order.oDeliveryAddr, this.form.value);
    this.Order.aOrderTrack = [{
      dtDate: new Date(),
      "status": "order-placed",
      "sRemarks": "order received."
    }];
    let text = ` <html> <head><style type="text/css">
    .border {
      border-collapse: collapse;
      border: 1px solid #000000;
      text-align: center;
    }
    .borderStyle{
      border: 1px solid #000000;
    }

   </style> <title></title></head>`
    text += '<body><p>Hi ' + this.userData.sName + ', <br>Your order ' + this.Order.sOrderNo + ' is successfully placed. find the order details below.</p></body></html>'  + document.getElementById('print-section').innerHTML;
    this.Order.sPaymentMade = "PayTM";
    this.data.updateOrderDetails(this.Order, text);
  }
  setAddr(j) {
    this.form = this.config.geSectionForm(this.userData.aAddress[j], this.addrFields);
  }
  goto() {
    this.router.navigate(['products']);
  }
  calculateTotal() {
    this.Order.dTotalQuantity = 0;
    this.Order.dTotalAmount = 0;
    this.Order.aProduct.forEach(element => {
      this.Order.dTotalAmount += Number(element.dAmount) * Number(element.sQuantity);
      this.Order.dTotalQuantity += Number(element.sQuantity);
    });
  }
}
