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
const weFasthttpOptions = {
  headers: new HttpHeaders({
    "Authorization": "X-DV-Auth-Token EFAFD8ABF63D45876D2BF353C562AC1C2B53F564"
  })
};

@Injectable()
export class DataService {
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
    dFewLeftLimit: 12,
    dOutofStockLimit: 6,
    aVariants: [],
    aBrands: [],
    dAvgRating: null,
    sProductDesc: "",
    sMultipleSize: "No",
    sProductType: "",
    sVariety: "",
    aSizeList: [],
    dTaxPercent: 0,
    dTaxAmount: 0
  };
  Order = {
    sOrderNo: "",
    aProduct: [],
    sCustomerId: "",
    oDeliveryAddr: this.addrObj,
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
    sCourierNumber: "",
    sEmail: "",
    dPromotionPrice: 0,
    dDiscountPrice: 0,
    dActualPrice: 0,
    dTaxAmount: 0,
    dDeilveryAmount: null
  };
  Stock = {
    sAction: "",
    dtDate: null,
    sProductId: "",
    dQuantity: null,
    oDest: {},
    oSource: {}
  };
  finTransactionObj = {
    "sSLCode": "",
    "sGLCode": "",
    "sTransType": "",
    "sTransMode": "",
    "dtTransDate": new Date(),
    "downloadURL": "",
    "bFileAdded": false,
    "sDebtorName": "",
    "sDebtorContact": "",
    "sCreditorName": "",
    "sCreditorContact": "",
    "dTransAmount": null,
    "sTransactionID": ""
  }
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
    "CALLBACK_URL": environment.CALLBACK_URL
  };
  BasicStockChartOptions = {
    chart: {
      type: "bar"
    },
    title: {
      text: "Product-wise Stock Analysis"
    },
    subtitle: {
      text: "Product vs Stocks"
    },
    xAxis: {
      categories: []
    },
    yAxis: {
      title: {
        text: "Product Name"
      },
      labels: {
        overflow: 'justify'
      }
    },
    tooltip: {
      valueSuffix: " Units"
    },
    series: [
      {
        name: 'Stock Available',
        data: []
      },
      {
        name: 'Stock Sold',
        data: []
      },
      {
        name: 'Added In Cart',
        data: []
      },
      {
        name: 'Stock Demanded',
        data: []
      }
    ]
  };
  BasicOrderChartOptions = {
    chart: {
      type: "spline"
    },
    title: {
      text: "Order Analysis"
    },
    subtitle: {
      text: "Day vs Order Details"
    },
    xAxis: {
      title: {
        text: "Day"
      },
      labels: {
        overflow: 'justify'
      },
      categories: []
    },
    yAxis: {
      title: {
        text: "Orders Placed"
      },
      labels: {
        overflow: 'justify'
      },
    },
    tooltip: {
      valueSuffix: " Units"
    },
    series: [
      {
        name: 'Orders Received',
        data: []
      },
      {
        name: 'Orders Delivered',
        data: []
      },
      {
        name: 'Orders shipped',
        data: []
      },
      {
        name: 'Orders on Way',
        data: []
      },
      {
        name: 'Orders Cancelled',
        data: []
      },
      {
        name: 'Orders Payment Done',
        data: []
      },
      {
        name: 'Orders Payment Failed',
        data: []
      }
    ]
  };
  BasicFinanceChartOptions = {
    chart: {
      type: "spline"
    },
    title: {
      text: "Finance Track"
    },
    subtitle: {
      text: "Day vs Amount"
    },
    xAxis: {
      title: {
        text: "Day"
      },
      labels: {
        overflow: 'justify'
      },
      categories: []
    },
    yAxis: {
      title: {
        text: "Amount"
      },
      labels: {
        overflow: 'justify'
      },
    },
    tooltip: {
      valueSuffix: " Rs."
    },
    series: [
      {
        name: 'Amount spent',
        data: []
      },

    ]
  };
  MainPage: any = {};
  AllOrders: any = [];
  AllStocks: any = [];
  AllFinances: any = [];
  Promocodes: any = {};
  promoKeys: any = [];
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
    this.bDisableScreen = true;
    temp.valueChanges().subscribe(data => {
      this.bDisableScreen = false;
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
    }.bind(this));
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
  updateMasterDetls(master, name) {
    this.db.object("/Masters/" + name).set(master);
  }
  getPromocode() {
    this.bDisableScreen = true;
    let temp = this.db.list("/Promocodes");
    temp.valueChanges().subscribe(data => {
      this.bDisableScreen = false;
      this.Promocodes = data;
      if (this.Promocodes.length > 0) {
        this.promoKeys = Object.keys(this.Promocodes[0]);
      }
    });
  }
  updatePromocodeDetls(master, name) {
    this.db.object("/Promocodes/" + name).set(master);
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
        "sEmail": order.sEmail,
        "sSubject": "TechPixels: Order Details",
        "sContent": html
      }
    }
    this.bDisableScreen = true;
    this.sendEmail(request).subscribe(res => {
      if (res.accepted.length > 0) {
        this.db.object("/Orders/" + order.sOrderNo).update(order)
          .then(function () {
            if (order.sOrderSource = "Offline" && order.sPaymentMade != "PayTM") {
              alert("Order placed successfully")
            }
          })
          .catch(function (error) {
            if (order.sOrderSource = "Offline" && order.sPaymentMade != "PayTM") {
              alert("Could not place order.")
            }
          });
        order.aProduct.forEach(element => {
          let tempObj = JSON.parse(JSON.stringify(this.Stock));
          tempObj.oDest = order.oDeliveryAddr
          tempObj.oSource = order.oDeliveryAddr
          tempObj.dtDate = new Date();
          tempObj.sAction = "Sold";
          tempObj.sProductId = element.sProductId;
          tempObj.dQuantity = Number(element.sQuantity);
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
      this.calculateOrderAnalysis();
    });
  }
  calculateOrderAnalysis() {
    this.AllOrders = _.sortBy(this.AllOrders, 'dtDate').reverse();
    let currDate = this.AllOrders[0].dtDate;
    let OrderReceived = 0;
    let OrderOnWay = 0;
    let OrderShipped = 0;
    let OrderPaymentDone = 0;
    let OrderCancelled = 0;
    let OrderDelivered = 0;
    let OrderPaymentFailed = 0;
    this.BasicOrderChartOptions.xAxis.categories.push(currDate.toString());

    this.AllOrders.forEach(element => {
      if (element.dtDate < currDate) {
        let existInd = this.BasicOrderChartOptions.xAxis.categories.indexOf(element.dtDate);
        if (existInd >= 0) {

          currDate = new Date(this.BasicOrderChartOptions.xAxis.categories[existInd]);

          OrderReceived = this.BasicOrderChartOptions.series[0].data[existInd];
          OrderDelivered = this.BasicOrderChartOptions.series[1].data[existInd];
          OrderShipped = this.BasicOrderChartOptions.series[2].data[existInd];
          OrderOnWay = this.BasicOrderChartOptions.series[3].data[existInd];
          OrderCancelled = this.BasicOrderChartOptions.series[4].data[existInd];
          OrderPaymentDone = this.BasicOrderChartOptions.series[5].data[existInd];
          OrderPaymentFailed = this.BasicOrderChartOptions.series[6].data[existInd];
        } else {

          this.BasicOrderChartOptions.series[0].data.push(OrderReceived);
          this.BasicOrderChartOptions.series[1].data.push(OrderDelivered);
          this.BasicOrderChartOptions.series[2].data.push(OrderShipped);
          this.BasicOrderChartOptions.series[3].data.push(OrderOnWay);
          this.BasicOrderChartOptions.series[4].data.push(OrderCancelled);
          this.BasicOrderChartOptions.series[5].data.push(OrderPaymentDone);
          this.BasicOrderChartOptions.series[6].data.push(OrderPaymentFailed);

          OrderReceived = 0;
          OrderOnWay = 0;
          OrderShipped = 0;
          OrderPaymentDone = 0;
          OrderCancelled = 0;
          OrderDelivered = 0;
          OrderPaymentFailed = 0;

          currDate = element.dtDate;
          this.BasicOrderChartOptions.xAxis.categories.push(currDate.toString());
        }

      }
      if (element.sOrderStatus == "OS1") {
        OrderReceived += 1;
      } else if (element.sOrderStatus == "OS3") {
        OrderShipped += 1;
      } else if (element.sOrderStatus == "OS4") {
        OrderOnWay += 1;
      } else if (element.sOrderStatus == "OS2") {
        OrderPaymentDone += 1;
      } else if (element.sOrderStatus == "OS7") {
        OrderCancelled += 1;
      } else if (element.sOrderStatus == "OS6") {
        OrderDelivered += 1;
      } else if (element.sOrderStatus == "OS00") {
        OrderPaymentFailed += 1;
      }

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
    this.Order.sEmail = this.Users.sEmail;
    this.Order.sOrderStatus = "OS1";
    let master = this.getMasterVal("Order_Stage");
    let masterOBJ = _.findWhere(master, { "value": "OS1" });
    if (masterOBJ) {
      this.Order.sOrderViewStatus = masterOBJ.viewValue;
    }
    this.Order.aProduct = [];
    this.Order.dDiscountPrice = 0;
    this.Order.dTaxAmount = 0;
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
        this.Order.dDiscountPrice += Number(element.dActualPrice) - Number(element.dAmount);
        this.Order.dTotalQuantity += Number(element.sQuantity);
        this.Order.dTaxAmount += Number(element.dTaxAmount);
      });
    }
    this.Order.dActualPrice = this.Order.dTotalAmount + this.Order.dDiscountPrice;
    this.Order.oDeliveryAddr = this.Users.aAddress[0];
  }
  updateStockDetails(stock) {
    let id = this.generateTempImageId();
    this.db.object("/Stocks/" + id).update(stock);
  }
  updateFinanceDetails(obj) {
    let id = this.generateTempImageId();
    this.db.object("/Finances/" + id).update(obj);
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
      this.BasicStockChartOptions.xAxis.categories.push(element.sName);
      this.BasicStockChartOptions.series[0].data.push(element.dStockAvailable);
      this.BasicStockChartOptions.series[1].data.push(element.dStockSold);
      this.BasicStockChartOptions.series[2].data.push(element.dInCart);
      this.BasicStockChartOptions.series[3].data.push(element.dStockDemand);
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
  getMonthFinances() {
    this.bDisableScreen = true;
    this.postDataToServer({}, 'getFinances').subscribe(response => {
      this.bDisableScreen = false;
      this.AllFinances = response;

      if (this.AllFinances.length > 0) {
        let currDate = this.AllFinances[0].dtTransDate;
        let OrderReceived = Number(this.AllFinances[0].dTransAmount);
        this.BasicFinanceChartOptions.xAxis.categories.push(currDate.toString());
        this.AllFinances.forEach(element => {
          if (element.dtTransDate != currDate) {
            let existInd = this.BasicFinanceChartOptions.xAxis.categories.indexOf(element.dtTransDate);
            if (existInd >= 0) {
              currDate = new Date(this.BasicFinanceChartOptions.xAxis.categories[existInd]);
              OrderReceived = this.BasicFinanceChartOptions.series[0].data[existInd];
            } else {
              this.BasicFinanceChartOptions.series[0].data.push(OrderReceived);
              OrderReceived = 0;
              currDate = element.dtTransDate;
              this.BasicFinanceChartOptions.xAxis.categories.push(currDate.toString());
            }
          } else {
            OrderReceived += Number(element.dTransAmount);
          }
        });
      }
    }, error => {
      this.bDisableScreen = false;
      alert("Sorry, we could not fetch the requested details.");
    })
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
      this.payTmObj.CALLBACK_URL = environment.CALLBACK_URL + "#/orders"
    } else {
      this.payTmObj.CALLBACK_URL = environment.CALLBACK_URL
    }
    let req = {
      "Params": this.payTmObj
    };
    this.bDisableScreen = true;
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
    my_form.action = environment.PAYTM_URL;

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
        this.Order.sOrderStatus = "OS00";
        let masterOBJ = _.findWhere(master, { "value": "OS00" });
        if (masterOBJ) {
          this.Order.sOrderViewStatus = masterOBJ.viewValue;
        }
        text += '<body><p>Hi ' + this.Users.sName + ', <br>Payment for your order ' + this.Order.sOrderNo + ' has failed. Your payment transaction ID is: ' + response.TXNID;
        alertMsg = response.RESPMSG;
      } else {
        this.Order.sOrderStatus = "OS99";
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
  postDataToWeFast(requestJson, endpoint): Observable<any> {
    return this.http.post(environment.WEFAST_URL + endpoint, requestJson, weFasthttpOptions)
      .map(this.returnJsonResponse)
      .catch(this.handleErrorObservable)
  }

}

