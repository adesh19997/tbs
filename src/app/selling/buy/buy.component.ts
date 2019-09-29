import { Component, OnInit } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { DataService } from '../../services/data.service';
import { ConfigService } from '../../services/config.service';
import { FormGroup } from '@angular/forms';
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
    private config: ConfigService) {
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
    console.log(document.getElementById('print-section').innerHTML)
    let text = '<p>Hi ' + this.userData.sName + ', <br>Your order ' + this.Order.sOrderNo + ' is successfully placed. find the order details below.</p>' + document.getElementById('print-section').innerHTML;
    console.log(text);
    this.data.updateOrderDetails(this.Order,text);
  }
  setAddr(j) {
    this.form = this.config.geSectionForm(this.userData.aAddress[j], this.addrFields);
  }
}
