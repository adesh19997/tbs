import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
@Injectable()
export class DataService {
  Users = {
    uid: "",
    verified: false,
    sEmail: "",
    sName: "",
    sPhoneNumber: "",
    sUserImg: "",
    aCart: [],
    aAddress: [{
      sType: "",
      sLine1: "",
      sLine2: "",
      sLandmark: "",
      sPincode: "",
      sCity: "",
      sState: "",
      sCountry: "",
      sAddrContact: ""
    }]
  }
  Product = {
    sUid: "",
    sImages: [{
      "downloadURL": "../assets/images/upload.jpg",
      "state": "",
      "variant": "",
      "uid": ""
    }],
    sName: "",
    sCategory: "",
    aSubCategory: [],
    aProductLine: "",
    dPrice: null,
    dDiscountPrice: null,
    dStockAvailable: null,
    dStockSold: null,
    dInCart: null,
    aVariants: [],
    aBrands: [],
    dAvgRating: null,
    sProductDesc: ""
  };
  Order = {
    sOrderNo: "",
    sProductId: "",
    sProductName: "",
    sCustomerId: "",
    oDeliveryAddr: {},
    sOrderStatus: ""
  };
  Stock = {
    sAction: "",
    dDate: null,
    sProductID: "",
    dQuantity: null,
    oDest: {},
    oSource: {}
  };
  addrObj = {
    sType: "",
    sLine1: "",
    sLine2: "",
    sLandmark: "",
    sPincode: "",
    sCity: "",
    sState: "",
    sCountry: "",
    sAddrContact: ""
  }
  Products: any;
  Master: any;
  loading: any = false;
  constructor(private db: AngularFireDatabase) {
  }

  updateUserDetls(user) {
    this.db.object("/Users/" + user.sPhoneNumber).update(user);
  }
  updateProductDetails(product) {
    this.db.object("/Products/" + product.sUid).update(product);
  }
  deleteProductDetails(product) {
    this.db.object("/Products/" + product.sUid).remove();
  }
  getProducts() {
    let temp = this.db.list("/Products");
    temp.valueChanges().subscribe(data => {
      this.Products = data;
      this.Products.forEach(element => {
        if (!Array.isArray(element.aImages)) {
          element.aImages = [{
            "downloadURL": "../assets/images/upload.jpg",
            "state": "",
            "variant": "",
            "uid": ""
          }]
        }
      });
    });
  }
  getUserDetails(uid) {
    this.db.database.ref('/Users/' + uid).once('value').then(function (snapshot) {
      if (snapshot.val() && snapshot.val() instanceof Object) {
        this.Users = snapshot.val();
      }
    });
  }
  getMaster() {
    let temp = this.db.object("/Masters");
    temp.valueChanges().subscribe(data => {
      this.Master = data;
      this.loading = false;
    }, error => {
      this.loading = false;
    });
  }
  getProduct() {
    return JSON.parse(JSON.stringify(this.Product));
  }
  getMasterVal(masterName) {
    if (this.Master) {
      return this.Master[masterName];
    }
  }
}

