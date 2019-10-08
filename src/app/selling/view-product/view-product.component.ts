import { Component, OnInit } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { DataService } from '../../services/data.service';
import { ConfigService } from '../../services/config.service';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
@Component({
  selector: 'app-view-product',
  templateUrl: './view-product.component.html',
  styleUrls: ['./view-product.component.scss'],
  providers: [CurrencyPipe]
})
export class ViewProductComponent implements OnInit {
  product: any;
  addtoCartFields: any = [];
  form: FormGroup;
  cart: any = {};
  dQuantitiy: any = 1;
  constructor(public data: DataService,
    private config: ConfigService,
    private router: Router) {
    this.product = this.data.Product;
    this.addtoCartFields = this.config.setaddtoCartField();
    this.cart = this.data.cartObj;
    this.setForm();
  }

  ngOnInit() {
  }
  setForm() {
    this.form = this.config.geSectionForm(this.cart, this.addtoCartFields);
  }
  addToCart() {
    this.config.setData(this.addtoCartFields, this.cart, this.form.value);
    this.cart.sStatus = "new";
    this.cart.sQuantity = this.dQuantitiy;
    this.cart.dtAddedDate = new Date();
    this.cart.sProductId = this.product.sUid;
    this.cart.dAmount = this.product.dDiscountPrice;
    if (Array.isArray(this.data.Users.aCart)) {
      this.data.Users.aCart.push(this.cart);
    } else {
      this.data.Users.aCart = [this.cart];
    }
    this.data.updateUserDetls(this.data.Users);
  }
  buy() {
    if (this.data.Users.uid != null && this.data.Users.uid != undefined && this.data.Users.uid != "") {
      this.config.setData(this.addtoCartFields, this.cart, this.form.value);
      let temp = [{
        sProductId: this.product.sUid,
        sProductName: this.product.sName,
        sQuantity: this.dQuantitiy,
        dAmount: Number(this.product.dDiscountPrice)
      }]
      this.data.createOrder(temp);
      this.router.navigate(['products/buy']);
    } else {
      alert("Please fill basic information in my-info section.");
    }
  }
}
