import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DataService } from '../services/data.service';
import { ConfigService } from '../services/config.service';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss'],
  providers: [DatePipe]
})
export class OrderComponent implements OnInit {
  Orders: any = [];
  userData: any = {};
  constructor(public data: DataService,
    private config: ConfigService) {
    this.userData = this.data.Users;
    this.Orders = this.data.AllOrders;
    this.data.getOrder();
  }

  ngOnInit() {
  }

}
