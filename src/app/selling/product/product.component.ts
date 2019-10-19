import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';
import { StorageService } from '../../services/storage.service';
import { AuthenticateService } from '../../services/authenticate.service';
import { Router } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
  providers: [CurrencyPipe]
})
export class ProductComponent implements OnInit {
  constructor(public data: DataService,
    public storage: StorageService,
    public user: AuthenticateService,
    private router: Router) {
    if (sessionStorage.getItem("payTmReq") && sessionStorage.getItem("currOrder")) {
      let tempObj = JSON.parse(sessionStorage.getItem("payTmReq"));
      if (tempObj instanceof Object) {
        this.data.payTmObj = JSON.parse(sessionStorage.getItem("payTmReq"));
        this.data.Order = JSON.parse(sessionStorage.getItem("currOrder"));
        this.router.navigate(['products/buy']);
      }
    }
  }

  ngOnInit() {
    this.data.selectedProd = this.data.Posters[0];
  }

  gotoView(ind) {
    this.data.Product = this.data.Products[ind];
    this.router.navigate(['products/view']);
  }
  addToCart(ind) {
    let cart = JSON.parse(JSON.stringify(this.data.cartObj));
    cart.sStatus = "new";
    cart.dtAddedDate = new Date();
    cart.sProductId = this.data.Products[ind].sUid;
    cart.dAmount = this.data.Products[ind].dDiscountPrice;
    cart.sQuantity = "1";
    if (Array.isArray(this.data.Users.aCart)) {
      this.data.Users.aCart.push(cart);
    } else {
      this.data.Users.aCart = [cart];
    }
    this.data.updateUserDetls(this.data.Users);
  }
  poster(type) {
    if (type == 'prev' && this.data.selectedProd.index != 0) {
      this.data.selectedProd = this.data.Posters[(this.data.selectedProd.index - 1)];
    } else if (this.data.selectedProd.index != this.data.Posters.length - 1) {
      this.data.selectedProd = this.data.Posters[(this.data.selectedProd.index + 1)];
    }
  }
}
