import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';
import { StorageService } from '../../services/storage.service';
import { AuthenticateService } from '../../services/authenticate.service';
import { Router } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { ConfigService } from '../../services/config.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
  providers: [CurrencyPipe]
})
export class ProductComponent implements OnInit {
  aFilter: any = [];
  selectedFilter: any = -1;
  filterParams: any = [];
  constructor(public data: DataService,
    public storage: StorageService,
    private config: ConfigService,
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
    this.data.selectedProd = this.data.MainPage.aPosters[0];
    this.aFilter = this.config.getFilterConfig();
    if (this.data.Users.sPhoneNumber != null && this.data.Users.sPhoneNumber != undefined && this.data.Users.sPhoneNumber != "") {
      this.data.Users.uid = this.data.Users.sPhoneNumber;
      this.data.getUserDetails(this.data.Users.uid);
    } else {
      this.data.getAllUsers(this.data.Users.sEmail);
    }
  }

  gotoView(ind) {
    this.data.Product = this.data.Products[ind];
    this.router.navigate(['products/view']);
  }
  addToCart(ind, type) {
    let cart = JSON.parse(JSON.stringify(this.data.cartObj));
    cart.sStatus = "new";
    cart.dtAddedDate = new Date();
    cart.sProductId = this.data.Products[ind].sUid;
    cart.dAmount = this.data.Products[ind].dDiscountPrice;
    cart.dActualPrice = Number(this.data.Products[ind].dPrice);
    cart.dTaxAmount = Number(this.data.Products[ind].dTaxAmount);
    cart.sQuantity = "1";
    cart.sCartType = type;
    if (type == "cart") {
      if (isNaN(this.data.Products[ind].dInCart)) {
        this.data.Products[ind].dInCart = 1;
      } else {
        this.data.Products[ind].dInCart = Number(this.data.Products[ind].dInCart) + 1;
      }
    }
    if (type == "wishlist") {
      if (isNaN(this.data.Products[ind].dStockDemand)) {
        this.data.Products[ind].dStockDemand = 1;
      } else {
        this.data.Products[ind].dStockDemand = Number(this.data.Products[ind].dStockDemand) + 1;
      }
    }
    if (Array.isArray(this.data.Users.aCart)) {
      this.data.Users.aCart.push(cart);
    } else {
      this.data.Users.aCart = [cart];
    }
    this.data.updateUserDetls(this.data.Users);
    this.data.updateProductDetails(this.data.Products[ind]);
  }
  poster(type) {
    if (type == 'prev' && this.data.selectedProd.index != 0) {
      this.data.selectedProd = this.data.MainPage.aPosters[(this.data.selectedProd.index - 1)];
    } else if (this.data.selectedProd.index != this.data.MainPage.aPosters.length - 1) {
      this.data.selectedProd = this.data.MainPage.aPosters[(this.data.selectedProd.index + 1)];
    }
  }
  gotoProd(type, value) {
    this.aFilter = this.config.getFilterConfig();
    if (type == "All") {
      this.data.getProducts();
    } else {
      let req: any = {};
      Object.assign(req, { [type]: value });
      let filtObj: any = {};
      this.aFilter.forEach(element => {
        if (element.searchValue == type) {
          element.aOptions.forEach(opt => {
            if (opt.value == value) {
              opt.checked = true;
            }
          });
        }
      });
      Object.assign(filtObj, { "searchParam": type, "searchVal": value });
      this.filterParams.push(filtObj);
      this.data.getFilteredProducts(req);
    }
  }
  changeselectedFilter(ind) {
    if (this.selectedFilter == ind) {
      this.selectedFilter = -1;
    } else {
      this.selectedFilter = ind;
    }
  }
  changeFilter(checked, value, ind) {
    let bPresent = false;
    let presentInd = 0;
    this.filterParams.forEach((element, i) => {
      if (element.searchVal == value) {
        bPresent = true;
        presentInd = i;
      }
    });

    if (checked && !bPresent) {
      let filtObj: any = {};
      Object.assign(filtObj, { "searchParam": this.aFilter[ind].searchValue, "searchVal": value });
      this.filterParams.push(filtObj);
    } else if (!checked && bPresent) {
      this.filterParams.splice(presentInd, 1);
    }
    let req = {}
    this.filterParams.forEach((element, i) => {
      Object.assign(req, { [element.searchParam]: element.searchVal });
    });
    this.data.getFilteredProducts(req);
  }
}
