import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DataService } from '../services/data.service';
import { ConfigService } from '../services/config.service';
import { DatePipe } from '@angular/common';
import { CurrencyPipe } from '@angular/common';
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs/Subject';
import * as XLSX from 'xlsx';
import * as _ from 'underscore';
type AOA = any[][];
@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss'],
  providers: [DatePipe, CurrencyPipe]
})
export class OrderComponent implements OnInit {
  public modalRef: any;
  userData: any = {};
  orderField: any = [];
  newOrderField: any = [];
  chequeFields: any = [];
  addrField: any = [];
  orderform: FormGroup;
  newOrder: FormGroup;
  addrForm: FormGroup;
  chequeForm: FormGroup;
  selectedOrder: any = -1;
  orderTrack: any;
  orderObj: any = {};
  aOrderProducts: any = [];
  deliverAddr = this.data.addrObj;
  tempOrder: any = this.data.Order;
  tempChqObj: any = {};
  editChq: boolean = false;
  constructor(public data: DataService,
    private modalService: NgbModal,
    public datepipe: DatePipe,
    private config: ConfigService) {
    this.data.getOrder();
    this.userData = this.data.Users;
    this.orderField = this.config.setOrderTrackField();
    this.chequeFields = this.config.setChequeFields();
  }
  dir: any = "";
  private _onDestroy = new Subject<void>();
  ngOnInit() {
    if (sessionStorage.getItem("payTmReq") && sessionStorage.getItem("currOrder")) {
      let tempObj = JSON.parse(sessionStorage.getItem("payTmReq"));
      if (tempObj instanceof Object) {
        this.data.payTmObj = JSON.parse(sessionStorage.getItem("payTmReq"));
        this.data.Order = JSON.parse(sessionStorage.getItem("currOrder"));
        this.tempOrder = this.data.Order;
        this.data.checkTransStatus();
      }
    }
    this.data.getProducts();
  }
  openPopup(newContents) {
    this.modalRef = this.modalService.open(newContents, { windowClass: 'buss-modal' });
  }
  editOrderDetl(ind, editOrder) {
    this.selectedOrder = ind;
    if(!Array.isArray(this.data.AllOrders[this.selectedOrder].aChequeDetails)){
      this.data.AllOrders[this.selectedOrder].aChequeDetails = [];
    }
    this.orderTrack = JSON.parse(JSON.stringify(this.data.orderTrack));
    this.orderTrack.sDoneBy = this.data.Users.sEmail;
    this.orderTrack.sContact = this.data.Users.sPhoneNumber;
    this.orderform = this.config.geSectionForm(this.orderTrack, this.orderField);
    this.openPopup(editOrder);
  }
  SaveOrder() {
    this.config.setData(this.orderField, this.orderTrack, this.orderform.value);
    this.data.AllOrders[this.selectedOrder].sOrderStatus = this.orderTrack.status;
    let master = this.data.getMasterVal("Order_Stage");
    let masterOBJ = _.findWhere(master, { "value": this.orderTrack.status });
    if (masterOBJ) {
      this.orderTrack.status = masterOBJ.viewValue;
      this.data.AllOrders[this.selectedOrder].sOrderViewStatus = masterOBJ.viewValue;
    }
    this.data.AllOrders[this.selectedOrder].aOrderTrack.push(this.orderTrack);
    this.modalRef.close();
    this.data.updateOrder(this.data.AllOrders[this.selectedOrder]);
  }
  viewOrderTrack(ind, viewTrack) {
    this.selectedOrder = ind;
    this.openPopup(viewTrack);
  }
  addCheque(order) {
    order.aChequeDetails.push(JSON.parse(JSON.stringify(this.data.chequeObj)));
    this.tempChqObj = order.aChequeDetails[order.aChequeDetails.length - 1];
    this.getChqDetls(this.tempChqObj);
  }
  deleteCheque(order, ind) {
    order.aChequeDetails.sple(ind, 1);
  }
  editCheque(tempOrder, ind) {
    this.tempChqObj = tempOrder.aChequeDetails[ind]
    this.getChqDetls(tempOrder.aChequeDetails[ind]);
  }
  getChqDetls(data) {
    this.chequeForm = this.config.geSectionForm(data, this.chequeFields);
    this.editChq = true;
  }
  setChqData() {
    this.config.setData(this.chequeFields, this.tempChqObj, this.chequeForm.value);
    this.editChq = false;
  }
  downloadMaster() {
    /* generate worksheet */
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.data.AllOrders);
    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'sheet1');

    /* save to file */
    XLSX.writeFile(wb, 'Orders.xlsx');

  }
  sortTable(dataTable, key) {
    if (dataTable == "Order") {
      if (this.dir == 'asc') {
        this.data.AllOrders = _.sortBy(this.data.AllOrders, key).reverse();
        this.dir = 'dsc'
      } else {
        this.data.AllOrders = _.sortBy(this.data.AllOrders, key);
        this.dir = 'asc'
      }
    }
  }
  createHeader(addOrder) {
    this.newOrderField = this.config.setCreateOffLineOrderFields();
    this.addrField = this.config.setAddrFields();
    this.newOrder = this.config.geSectionForm({}, this.newOrderField);
    this.addrForm = this.config.geSectionForm(this.deliverAddr, this.addrField);
    this.aOrderProducts = [{
      sProductId: "",
      sProductName: "",
      sQuantity: "",
      dAmount: 0
    }];
    if (this.newOrder.controls["Category"]) {
      this.newOrder.controls["Category"].valueChanges
        .pipe(takeUntil(this._onDestroy))
        .subscribe(() => {
          let req = {
            "sCategory": this.newOrder.controls["Category"].value,
          }
          this.data.getFilteredProducts(req);
        });
    }
    if (this.newOrder.controls["SubCategory"]) {
      this.newOrder.controls["SubCategory"].valueChanges
        .pipe(takeUntil(this._onDestroy))
        .subscribe(() => {
          let req = {
            "aSubCategory": this.newOrder.controls["SubCategory"].value,
          }
          this.data.getFilteredProducts(req);
        });
    }
    if (this.newOrder.controls["Brands"]) {
      this.newOrder.controls["Brands"].valueChanges
        .pipe(takeUntil(this._onDestroy))
        .subscribe(() => {
          let req = {
            "aBrands": this.newOrder.controls["Brands"].value,
          }
          this.data.getFilteredProducts(req);
        });
    }
    this.openPopup(addOrder);
  }
  placeOrder(content) {
    this.config.setData(this.newOrderField, this.tempOrder, this.newOrder.value);
    this.config.setData(this.addrField, this.deliverAddr, this.addrForm.value);

    let date = new Date();
    let dateStr = this.datepipe.transform(date, 'dd-MM-yyyy');
    dateStr = dateStr.replace(new RegExp("-", 'g'), "");
    this.tempOrder.dtDate = new Date();
    this.tempOrder.dTotalAmount = 0;
    if (this.data.Users.dTotalOrder >= 0) {
      this.data.Users.dTotalOrder += 1;
    } else {
      this.data.Users.dTotalOrder = 1;
    }
    this.tempOrder.dtDate = new Date();
    this.tempOrder.sOrderNo = "AREP" + dateStr + this.tempOrder.sCustomerId + (this.data.AllOrders.length + 1).toString();
    this.tempOrder.sOrderStatus = "OS2";
    let master = this.data.getMasterVal("Order_Stage");
    let masterOBJ = _.findWhere(master, { "value": "OS2" });
    if (masterOBJ) {
      this.tempOrder.sOrderViewStatus = masterOBJ.viewValue;
    }
    this.tempOrder.aProduct = this.aOrderProducts;
    this.tempOrder.sPaymentMade = "Direct-Cash";
    this.tempOrder.oDeliveryAddr = this.deliverAddr;
    this.data.updateUserDetls(this.data.Users);
    this.calculateTotal();
    this.modalRef.close();
    this.openPopup(content)
  }
  deleteProduct(ind) {
    this.aOrderProducts.splice(ind, 1);
  }
  addProduct() {
    this.aOrderProducts.push({
      sProductId: "",
      sProductName: "",
      sQuantity: "1",
      dAmount: 0
    })
  }
  setProdData(opt, ind) {
    this.aOrderProducts[ind].sProductId = opt.sUid;
    this.aOrderProducts[ind].sProductName = opt.sName;
    this.aOrderProducts[ind].dAmount = opt.dDiscountPrice;
    this.aOrderProducts[ind].dPerBoxQantity = opt.dPerBoxQantity;
  }
  calculateTotal() {
    this.tempOrder.dTotalQuantity = 0;
    this.tempOrder.dTotalAmount = 0;
    this.aOrderProducts.forEach(element => {
      this.tempOrder.dTotalAmount += Number(element.dAmount) * Number(element.sQuantity);
      this.tempOrder.dTotalQuantity += Number(element.sQuantity);
    });
  }
  confirm() {
    this.tempOrder.aOrderTrack = [{
      dtDate: new Date(),
      "status": "order-placed",
      "sRemarks": "order received."
    }];
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
    text += '<body><p>Hi ' + this.userData.sName + ', <br>Your order ' + this.tempOrder.sOrderNo + ' is successfully placed. find the order details below.</p></body></html>' + document.getElementById('print-section').innerHTML;
    this.tempOrder.sOrderSource = "Offline";
    this.data.Order = this.tempOrder;

    if (this.tempOrder.sPaymentMade == "PayTM") {
      this.data.updateOrderDetails(this.tempOrder, text, true);
    } else {
      this.data.updateOrderDetails(this.tempOrder, text, false);
    }

    this.modalRef.close();
  }
}
