import { Component, OnInit } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { DataService } from '../../services/data.service';
@Component({
  selector: 'app-view-product',
  templateUrl: './view-product.component.html',
  styleUrls: ['./view-product.component.scss'],
  providers: [CurrencyPipe]
})
export class ViewProductComponent implements OnInit {
  product: any;
  constructor(public data: DataService, ) {
    this.product = this.data.Product
  }

  ngOnInit() {
  }

}
