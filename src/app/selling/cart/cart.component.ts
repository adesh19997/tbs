import { Component, OnInit } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { DataService } from '../../services/data.service';
import { ConfigService } from '../../services/config.service';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
  providers: [CurrencyPipe]
})
export class CartComponent implements OnInit {
  myCart: any = [];
  constructor(public data: DataService,
    private config: ConfigService,
    private router: Router) {
    this.myCart = JSON.parse(JSON.stringify(this.data.Users.aCart));
    this.getProduct();
  }

  ngOnInit() {
  }
  getProduct() {
    if (Array.isArray(this.myCart)) {
      this.myCart.forEach(element => {
        let tempProdObj = this.data.Products.filter(obj => obj.sUid === element.sProductId);
        if (tempProdObj.length > 0) {
          Object.assign(element, { "ProdDetls": tempProdObj[0] });
        }
      });
    }
  }
  delete(i) {
    if (this.data.Users.uid != null && this.data.Users.uid != undefined && this.data.Users.uid != "") {
      this.myCart.splice(i, 1);
      this.data.Users.aCart.splice(i, 1);
      this.data.updateUserDetls(this.data.Users);
    } else {
      alert("Please fill basic information in my-info section.");
    }
  }
  buy(i) {
    if (this.data.Users.uid != null && this.data.Users.uid != undefined && this.data.Users.uid != "") {
      this.myCart[i].sProductName = this.myCart[i].ProdDetls.sName;
      this.data.createOrder([this.myCart[i]]);
      this.router.navigate(['products/buy']);
    } else {
      alert("Please fill basic information in my-info section.");
    }
  }
  buyAll() {
    if (this.data.Users.uid != null && this.data.Users.uid != undefined && this.data.Users.uid != "") {
      this.data.createOrder(this.myCart);
      this.router.navigate(['products/buy']);
    } else {
      alert("Please fill basic information in my-info section.");
    }
  }
}
