import { Component, OnInit } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { DataService } from '../../services/data.service';
import { ConfigService } from '../../services/config.service';
@Component({
  selector: 'app-my-order',
  templateUrl: './my-order.component.html',
  styleUrls: ['./my-order.component.scss'],
  providers: [CurrencyPipe]
})
export class MyOrderComponent implements OnInit {
  orders: any = [];
  constructor(
    public data: DataService,
    private config: ConfigService
  ) { }

  ngOnInit() {
    this.getMyOrders();
  }
  getMyOrders() {
    this.orders = this.data.AllOrders.filter(obj => obj.sCustomerId == this.data.Users.sPhoneNumber);
  }

}
