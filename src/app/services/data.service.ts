import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { DatePipe } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from "../../environments/environment";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs/Observable';
import * as _ from 'underscore';

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
    dtDOB: null,
    sGender: "",
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
    dStockDemand: null,
    dInCart: null,
    aVariants: [],
    aBrands: [],
    dAvgRating: null,
    sProductDesc: "",
    sMultipleSize: "No",
    sProductType: "",
    sVariety: "",
    aSizeList: []
  };
  Order = {
    sOrderNo: "",
    aProduct: [],
    sCustomerId: "",
    oDeliveryAddr: {},
    sOrderStatus: "",
    sOrderViewStatus: "",
    dTotalAmount: 0,
    dTotalQuantity: 0,
    dtDate: null,
    sPaymentMade: "",
    aOrderTrack: [],
    transResponse: null,
    sOrderSource: "website",
    aChequeDetails: [],
    sCourierNumber: ""
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
    sStatus: "",
    sCartType: "cart"
  };
  chequeObj = {
    sBankName: "",
    sChequeNo: "",
    dtChDate: "",
    dAmount: "",
    sStatus: "Received"
  };
  sizeListObj = {
    sSize: "",
    dAmount: ""
  }
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
  payTmObj = {
    "MID": environment.PAYTM_MID,
    "WEBSITE": "WEBSTAGING",
    "INDUSTRY_TYPE_ID": "Retail",
    "CHANNEL_ID": "WEB",
    "ORDER_ID": "xxxxx",
    "CUST_ID": "xxxxx",
    "MOBILE_NO": "xxxx",
    "EMAIL": "xxxx",
    "TXN_AMOUNT": "1.00",
    "CALLBACK_URL": "https://tecpixels-bs.firebaseapp.com/"
  };
  MainPage: any = {};
  AllOrders: any = [];
  AllStocks: any = [];
  Products: any;
  Master: any;
  ConfigData: any = {};
  loading: any = false;
  onlyProduct: any = false;
  paytmTransResponse: any = {};
  bDisableScreen: boolean = false;
  bShowAdminPage: boolean = false;
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
      this.onlyProduct = true;
    });
  }
  getUserDetails(uid) {
    this.db.database.ref('/Users/' + uid).once('value').then(function (snapshot) {
      if (snapshot.val() && snapshot.val() instanceof Object) {
        this.Users = snapshot.val();
        if (this.ConfigadminUser.includes(this.Users.sEmail)) {
          this.bShowAdminPage = true;
        }
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
            if (this.ConfigData.adminUser.includes(this.Users.sEmail)) {
              this.bShowAdminPage = true;
            }
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
  updateOrderDetails(order, html, transaction) {
    let request = {
      "mailDetails": {
        "sEmail": this.Users.sEmail,
        "sSubject": "TechPixels: Order Details",
        "sContent": html
      }
    }
    this.bDisableScreen = true;
    this.sendEmail(request).subscribe(res => {
      if (res.accepted.length > 0) {
        this.db.object("/Orders/" + order.sOrderNo).update(order)
          .then(function () {

          })
          .catch(function (error) {

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
        if (transaction) {
          this.initiatePayment();
        } else {
          this.bDisableScreen = false;
        }
      } else {
        this.bDisableScreen = false;
      }
    }, error => {
      this.bDisableScreen = false;
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
    dateStr = dateStr.replace(new RegExp("-", 'g'), "");
    if (isNaN(this.Users.dTotalOrder)) {
      this.Users.dTotalOrder = 0;
    }
    this.Order.dtDate = new Date();
    this.Order.dTotalAmount = 0;
    this.Order.dTotalQuantity = 0;
    this.Users.dTotalOrder += 1;
    this.Order.sOrderNo = "YMS" + dateStr + this.Users.sPhoneNumber + (this.AllOrders.length + 1).toString();
    this.Order.sCustomerId = this.Users.sPhoneNumber;
    this.Order.sOrderStatus = "OS1";
    let master = this.getMasterVal("Order_Stage");
    let masterOBJ = _.findWhere(master, { "value": "OS1" });
    if (masterOBJ) {
      this.Order.sOrderViewStatus = masterOBJ.viewValue;
    }
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
        this.Order.dTotalAmount += Number(element.dAmount) * Number(element.sQuantity);
        this.Order.dTotalQuantity += Number(element.sQuantity);
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
      this.calculateAvailableStock();
    });
  }
  calculateAvailableStock() {
    this.Products.forEach(element => {
      element.dStockAvailable = 0;
      let Stocks = this.getStocks(element.sUid);
      element.dStockSold = 0;
      Stocks.forEach(stockElem => {
        if (stockElem.sAction == "Sold") {
          element.dStockSold += Number(stockElem.dQuantity);
        } else if (stockElem.sAction == "Add") {
          element.dStockAvailable += Number(stockElem.dQuantity);
        }
      });
      element.dStockAvailable = Number(element.dStockAvailable) - element.dStockSold;
      this.updateProductDetails(element);
    });

  }
  getStocks(id) {
    return this.AllStocks.filter(obj => obj.sProductId == id);
  }
  getMainPage() {
    let temp = this.db.object("/MainPage");
    this.loading = true;
    temp.valueChanges().subscribe(data => {
      this.loading = false;
      let tempObj: any = {}
      tempObj = data;
      if (tempObj instanceof Object) {
        this.MainPage = tempObj;
      }

      if (this.MainPage.aPosters.length > 0) {
        this.selectedProd = this.MainPage.aPosters[0];
      }
    }, error => {
      this.loading = false;
    });
  }
  getConfig() {
    let temp = this.db.object("/ConfigDetails");
    this.loading = true;
    temp.valueChanges().subscribe(data => {
      this.loading = false;
      this.ConfigData = data;
      this.getMainPage();
    }, error => {
      alert("No data found.");
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
    let request = {
      "filterParams": req
    }
    this.bDisableScreen = true;
    this.postDataToServer(request, 'getFilteredProducts').subscribe(response => {
      this.bDisableScreen = false;
      if (Array.isArray(response)) {
        this.Products = response;
        this.onlyProduct = true;
      } else {
        alert("error fetching products");
      }
    }, error => {
      this.bDisableScreen = false;
      alert("error fetching products" + error);
    })
  }
  initiatePayment() {
    this.payTmObj.CUST_ID = this.Users.sPhoneNumber;
    this.payTmObj.EMAIL = this.Users.sEmail;
    this.payTmObj.MOBILE_NO = this.Users.sPhoneNumber;
    this.payTmObj.ORDER_ID = this.Order.sOrderNo;
    this.payTmObj.TXN_AMOUNT = this.Order.dTotalAmount.toString();
    if (this.Order.sOrderSource == "Offline") {
      this.payTmObj.CALLBACK_URL = "https://tecpixels-bs.firebaseapp.com/#/orders"
    } else {
      this.payTmObj.CALLBACK_URL = "https://tecpixels-bs.firebaseapp.com/"
    }
    let req = {
      "Params": this.payTmObj
    };
    this.postDataToServer(req, "checksum").subscribe(response => {
      this.bDisableScreen = false;
      this.payTmObj['CHECKSUMHASH'] = response;
      sessionStorage.setItem("payTmReq", JSON.stringify(this.payTmObj));
      sessionStorage.setItem("currOrder", JSON.stringify(this.Order));
      this.createPaytmForm();
    }, error => {
      this.bDisableScreen = false;
      alert("Order could not be placed,please try again after some time.");
    })
  }
  createPaytmForm() {
    const my_form: any = document.createElement('form');
    my_form.name = 'paytm_form';
    my_form.method = 'post';
    my_form.action = 'https://securegw-stage.paytm.in/order/process';

    const myParams = Object.keys(this.payTmObj);
    for (let i = 0; i < myParams.length; i++) {
      const key = myParams[i];
      let my_tb: any = document.createElement('input');
      my_tb.type = 'hidden';
      my_tb.name = key;
      my_tb.value = this.payTmObj[key];
      my_form.appendChild(my_tb);
    };

    document.body.appendChild(my_form);
    my_form.submit();
  };
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
  postDataToPaytm(requestJson): Observable<any> {
    return this.http.post('https://securegw-stage.paytm.in/order/status', requestJson, httpOptions)
      .map(this.returnJsonResponse)
      .catch(this.handleErrorObservable)
  }
  checkTransStatus() {
    let request = {
      "MID": this.payTmObj.MID,
      "ORDERID": this.payTmObj.ORDER_ID,
      "CHECKSUMHASH": this.payTmObj['CHECKSUMHASH']
    }
    this.postDataToPaytm(request).subscribe(response => {
      this.paytmTransResponse = response;
      this.Order.transResponse = response;
      let master = this.getMasterVal("Order_Stage");
      let alertMsg = "";
      let text = ` <html> <head><style type="text/css">
      .border {
            border-collapse: collapse;
            border: 1px solid #000000;
            text-align: center;
          }
          .borderStyle{
            border: 1px solid #000000;
          }

        </style> <title></title></head>`
      if (response.STATUS == "TXN_SUCCESS") {
        this.Order.sOrderStatus = "OS2";

        let masterOBJ = _.findWhere(master, { "value": "OS2" });
        if (masterOBJ) {
          this.Order.sOrderViewStatus = masterOBJ.viewValue;
        }
        text += '<body><p>Hi ' + this.Users.sName + ', <br>Payment for your order ' + this.Order.sOrderNo + ' is successfully done. Your payment transaction ID is: ' + response.TXNID;
        alertMsg = "Congragulations payment done successfully!";
      } else if (response.STATUS == "TXN_FAILURE") {
        let masterOBJ = _.findWhere(master, { "value": "OS00" });
        if (masterOBJ) {
          this.Order.sOrderViewStatus = masterOBJ.viewValue;
        }
        text += '<body><p>Hi ' + this.Users.sName + ', <br>Payment for your order ' + this.Order.sOrderNo + ' has failed. Your payment transaction ID is: ' + response.TXNID;
        alertMsg = response.RESPMSG;
      } else {
        let masterOBJ = _.findWhere(master, { "value": "OS99" });
        if (masterOBJ) {
          this.Order.sOrderViewStatus = masterOBJ.viewValue;
        }
        text += '<body><p>Hi ' + this.Users.sName + ', <br>Payment for your order ' + this.Order.sOrderNo + ' is pending. Your payment transaction ID is: ' + response.TXNID;
        alertMsg = response.RESPMSG;
      }
      sessionStorage.removeItem("currOrder");
      sessionStorage.removeItem("payTmReq");
      this.updateOrderDetails(this.Order, text, false);
      alert(alertMsg);
    }, error => {
      alert("error fetching products" + error);
    })
  }
}

