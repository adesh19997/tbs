import { Component, OnInit } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { DataService } from '../../services/data.service';
import { ConfigService } from '../../services/config.service';
import { FormGroup } from '@angular/forms';
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
  addrFields: any = [];
  constructor(public data: DataService,
    private config: ConfigService,
    private router: Router) {
    this.Order = this.data.Order;
    this.userData = this.data.Users;
    this.addrFields = this.config.setAddrFields();
    this.setAddr(0);
  }

  ngOnInit() {
  }
  buy() {
    this.config.setData(this.addrFields, this.Order.oDeliveryAddr, this.form.value);
    this.Order.aOrderTrack = [{
      dtDate: new Date(),
      "status": "order-placed",
      "sRemarks": "order received."
    }];
    let text = ` <html> <head><style type="text/css">.table {
      & th {
          line-height: 1.5em;
          font-size: .875em !important;
          color: #000000;
          padding: .5em 1em;
          border: 1px solid #e9ebec;
          font-weight: 700;
      }
  
      & td {
          padding: .5em 1em !important;
          vertical-align: middle !important;
          border: 1px solid #e9ebec;
      }
  
      & td:last {
          padding: 0px;
      }
  
      & .mat-form-field-infix {
          width: auto;
      }
  }
   </style> <title></title></head>`
    text += '<p>Hi ' + this.userData.sName + ', <br>Your order ' + this.Order.sOrderNo + ' is successfully placed. find the order details below.</p>' + document.getElementById('print-section').innerHTML;
    this.data.updateOrderDetails(this.Order, text);
  }
  setAddr(j) {
    this.form = this.config.geSectionForm(this.userData.aAddress[j], this.addrFields);
  }
  goto(){
    this.router.navigate(['products']);
  }
}
