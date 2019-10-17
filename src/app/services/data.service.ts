import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { DatePipe } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from "../../environments/environment";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs/Observable';
const BASE_URL = environment.BASE_URL;
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
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
    dTotalOrder: 0,
    aAddress: [{
      sType: "",
      sLine1: "",
      sLine2: "",
      sLandmark: "",
      sPincode: "",
      sCity: "",
      sState: "",
      sCountry: "",
      sAddrContact: "",
      sPhoneNumber: ""
    }]
  }
  Product = {
    sUid: "",
    aImages: [{
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
    aProduct: [],
    sCustomerId: "",
    oDeliveryAddr: {},
    sOrderStatus: "",
    dTotalAmount: null,
    dtDate: null,
    sPaymentMade: "",
    aOrderTrack: []
  };
  Stock = {
    sAction: "",
    dtDate: null,
    sProductId: "",
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
    sAddrContact: "",
    sPhoneNumber: ""
  };
  cartObj = {
    sQuantity: "",
    sProductId: "",
    dAmount: 0,
    dtAddedDate: null,
    sStatus: ""
  };
  selectedProd = {
    index: 0,
    sUrl: ""
  };
  orderTrack = {
    dtDate: new Date(),
    "status": "",
    "sRemarks": ""
  };
  reviewObj = {
    sDescription: "",
    dRating: 0,
    sUserID: this.Users.sPhoneNumber,
    sUserName: this.Users.sName,
    dtDate: new Date()
  }
  Posters: any = [];
  AllOrders: any = [];
  AllStocks: any = [];
  Products: any;
  Master: any;
  loading: any = false;
  onlyProduct: any = false;
  constructor(private db: AngularFireDatabase,
    public datepipe: DatePipe,
    private http: HttpClient, ) {
  }

  updateUserDetls(user) {
    this.db.object("/Users/" + user.uid).update(user);
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
    })
      .catch(function (erroe) {

      });
  }
  getAllUsers(uid) {
    let temp = this.db.list("/Users");
    temp.valueChanges().subscribe(data => {
      let tempArr: any;
      tempArr = data;
      if (tempArr.length > 0) {
        tempArr.forEach(element => {
          if (element.sEmail == uid) {
            this.Users = element;
            return false;
          }
        });
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
  updateOrder(order) {
    this.db.object("/Orders/" + order.sOrderNo).update(order)
      .then(function () {
        alert("Order successfully Updated.");
      })
      .catch(function (error) {
        alert("Sorry, Order could not be placed.");
      });
  }
  updateOrderDetails(order, html) {
    let request = {
      "mailDetails": {
        "sEmail": this.Users.sEmail,
        "sSubject": "TechPixels: Order Placed",
        "sContent": html
      }
    }
    this.sendEmail(request).subscribe(res => {
      if (res.accepted.length > 0) {
        this.db.object("/Orders/" + order.sOrderNo).update(order)
          .then(function () {
            alert("Order successfully Placed");
          })
          .catch(function (error) {
            alert("Sorry, Order could not be placed.");
          });
        order.aProduct.forEach(element => {
          let tempObj = JSON.parse(JSON.stringify(this.Stock));
          tempObj.oDest = order.oDeliveryAddr
          tempObj.oSource = order.oDeliveryAddr
          tempObj.dtDate = new Date();
          tempObj.sAction = "Sold";
          tempObj.sProductId = element.sProductId;
          tempObj.dQuantity = Number(element.sQuantity);
          this.updateStockDetails(tempObj);
        });
      } else {
        alert("Sorry, Order could not be placed.");
      }
    })

  }
  deleteOrderDetails(order) {
    this.db.object("/Orders/" + order.sOrderNo).remove();
  }
  getOrder() {
    let temp = this.db.list("/Orders");
    temp.valueChanges().subscribe(data => {
      this.AllOrders = data;
    });
  }
  createOrder(products) {
    let date = new Date();
    let dateStr = this.datepipe.transform(date, 'dd-MM-yyyy');
    if (isNaN(this.Users.dTotalOrder)) {
      this.Users.dTotalOrder = 0;
    }
    this.Order.dtDate = new Date();
    this.Order.dTotalAmount = 0;
    this.Users.dTotalOrder += 1;
    this.Order.sOrderNo = dateStr + "-" + this.Users.sPhoneNumber + '-' + this.Users.dTotalOrder.toString();
    this.Order.sCustomerId = this.Users.sPhoneNumber;
    this.Order.sOrderStatus = "OS1";
    this.Order.aProduct = [];
    if (Array.isArray(products)) {
      products.forEach(element => {
        let temp = {
          sProductId: element.sProductId,
          sProductName: element.sProductName,
          sQuantity: element.sQuantity,
          dAmount: element.dAmount
        };
        this.Order.aProduct.push(temp);
        this.Order.dTotalAmount += Number(element.dAmount);
      });
    }
    this.Order.oDeliveryAddr = this.Users.aAddress[0];
  }
  updateStockDetails(stock) {
    let id = this.generateTempImageId();
    this.db.object("/Stocks/" + id).update(stock);
  }
  getAllStocks() {
    let temp = this.db.list("/Stocks");
    temp.valueChanges().subscribe(data => {
      this.AllStocks = data;
    });
  }
  getStocks(id) {
    return this.AllStocks.filter(obj => obj.sProductId == id);
  }
  getPoster() {
    let temp = this.db.list("/Poster");
    this.loading = true;
    temp.valueChanges().subscribe(data => {
      this.loading = false;
      this.Posters = data;
      if (this.Posters.length > 0) {
        this.selectedProd = this.Posters[0];
      }
    }, error => {
      this.loading = false;
    });
  }
  generateTempImageId() {
    let id = Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 10);
    return id.toUpperCase();
  }
  sendEmail(requestJson): Observable<any> {
    return this.http.post(BASE_URL + 'sendEmail', requestJson, httpOptions)
      .map(this.returnJsonResponse)
      .catch(this.handleErrorObservable)
  }
  getFilteredProducts(req) {
    this.postDataToServer(req, 'getFilteredProducts').subscribe(response => {
      if (Array.isArray(response)) {
        this.Products = response;
      } else {
        alert("error fetching products");
      }
    }, error => {
      alert("error fetching products" + error);
    })
  }
  private returnJsonResponse(res: any) {
    return res;
  }
  private handleErrorObservable(error: any) {
    return Observable.throw(error);
  }
  postDataToServer(requestJson, endpoint): Observable<any> {
    return this.http.post(BASE_URL + endpoint, requestJson, httpOptions)
      .map(this.returnJsonResponse)
      .catch(this.handleErrorObservable)
  }
}

