import { Component, OnInit } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { DataService } from '../../services/data.service';
import { ConfigService } from '../../services/config.service';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-view-product',
  templateUrl: './view-product.component.html',
  styleUrls: ['./view-product.component.scss'],
  providers: [CurrencyPipe, DatePipe]
})
export class ViewProductComponent implements OnInit {
  product: any;
  addtoCartFields: any = [];
  form: FormGroup;
  cart: any = {};
  dQuantitiy: any = 1;
  selectedImgUrl: any = "";
  dRating: any = 0;
  reviewDesc: any = "";
  selectedSize: any = -1;
  constructor(public data: DataService,
    private config: ConfigService,
    private router: Router) {
    this.product = this.data.Product;
    this.selectedImgUrl = this.product.aImages[0].downloadURL;
    this.product.selectedImgInd = 0;
    this.addtoCartFields = this.config.setaddtoCartField();
    this.cart = this.data.cartObj;
    this.setForm();
  }

  ngOnInit() {
    if (!Array.isArray(this.product.aReviews)) {
      this.product.aReviews = [];
    }
  }
  setForm() {
    this.form = this.config.geSectionForm(this.cart, this.addtoCartFields);
  }
  addToCart(type) {
    this.config.setData(this.addtoCartFields, this.cart, this.form.value);
    this.cart.sStatus = "new";
    this.cart.sQuantity = this.dQuantitiy;
    this.cart.dtAddedDate = new Date();
    this.cart.sProductId = this.product.sUid;
    this.cart.dAmount = this.product.dDiscountPrice;
    this.cart.dActualPrice = Number(this.product.dPrice);
    this.cart.dTaxAmount = Number(this.product.dTaxAmount);
    if (type == "cart") {
      if (isNaN(this.product.dInCart)) {
        this.product.dInCart = 1;
      } else {
        this.product.dInCart = Number(this.product.dInCart) + 1;
      }
    }
    if (type == "wishlist") {
      if (isNaN(this.product.dStockDemand)) {
        this.product.dStockDemand = 1;
      } else {
        this.product.dStockDemand = Number(this.product.dStockDemand) + 1;
      }
    }
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
        dAmount: Number(this.product.dDiscountPrice),
        dActualPrice: Number(this.product.dPrice),
        dTaxAmount : Number(this.product.dTaxAmount)
      }]
      this.data.createOrder(temp);
      this.router.navigate(['products/buy']);
    } else {
      alert("Please fill basic information in my-info section.");
    }
  }
  poster(type) {
    if (type == 'prev' && this.product.selectedImgInd != 0) {
      this.selectedImgUrl = this.product.aImages[(this.product.selectedImgInd - 1)].downloadURL;
      this.product.selectedImgInd = this.product.selectedImgInd - 1;
    } else if (this.product.selectedImgInd != this.product.aImages.length - 1) {
      this.selectedImgUrl = this.product.aImages[(this.product.selectedImgInd + 1)].downloadURL;
      this.product.selectedImgInd = this.product.selectedImgInd + 1;
    }
  }
  addReview() {
    if (!Array.isArray(this.product.aReviews)) {
      this.product.aReviews = [];
    }
    let reviewObj = JSON.parse(JSON.stringify(this.data.reviewObj));
    reviewObj.dRating = this.dRating;
    reviewObj.sDescription = this.reviewDesc;
    reviewObj.sUserID = this.data.Users.sPhoneNumber;
    reviewObj.sUserName = this.data.Users.sName;
    this.product.aReviews.push(reviewObj);
    this.product.dAvgRating = 0;
    this.product.aReviews.forEach(element => {
      this.product.dAvgRating += element.dRating;
    });
    this.product.dAvgRating = Math.ceil(this.product.dAvgRating / this.product.aReviews.length);
    this.data.updateProductDetails(this.product);
  }
  setRating(rating) {
    this.dRating = rating;
  }
  selectSize(amount, i) {
    this.selectedSize = i;
    this.product.dDiscountPrice = Number(amount);
    this.product.dDiscountPercent = ((1 - Number(amount) / Number(this.product.dPrice)) * 100).toFixed(2);
  }
}
