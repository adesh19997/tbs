import { Component, OnInit } from '@angular/core';
import { ConfigService } from '../services/config.service';
import { DataService } from '../services/data.service';
import { StorageService } from '../services/storage.service';
import { AuthenticateService } from '../services/authenticate.service';
import { FormGroup } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import * as XLSX from 'xlsx';
import * as _ from 'underscore';
type AOA = any[][];
@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.scss'],
  providers: [DatePipe]
})
export class InventoryComponent implements OnInit {
  public modalRef: any;
  field: any = [];
  form: FormGroup;
  stockform: FormGroup;
  stockRecform: FormGroup;
  stockDelform: FormGroup;
  addField: any = [];
  stockField: any = [];
  addrField: any = [];
  addform: FormGroup;
  Products: any;
  addProd: boolean = false;
  Product: any;
  addImg: boolean = false;
  currUser: any;
  isEdit: boolean = false;
  selectedStock: any = 0;
  selectedProduct: any = 0;
  Stocks: any = [];
  compData = {
    selectedCat: "",
    selectedSubCat: ""
  };
  aSizes = this.data.getMasterVal("Size");
  dir: any = "";
  excelBuffer: any;
  constructor(private config: ConfigService,
    public data: DataService,
    public storage: StorageService,
    private modalService: NgbModal,
    public user: AuthenticateService) {
    this.field = this.config.setInventoryFields();
    this.form = this.config.geSectionForm(this.compData, this.field);
    this.stockField = this.config.setStockFieldForm();
    this.addrField = this.config.setAddrFields();
    this.data.getProducts();
  }

  ngOnInit() {
    this.Products = this.data.Products;
    this.currUser = this.data.Users;
    this.data.getAllStocks();
  }
  addProduct() {
    if (this.currUser.sPhoneNumber != "" && this.currUser.sPhoneNumber != null) {
      this.Stocks = [];
      this.Product = JSON.parse(JSON.stringify(this.data.getProduct()));
      if (!Array.isArray(this.Product.aSizeList)) {
        this.Product.aSizeList = [];
      }
      this.addField = this.config.setAddFieldForm();
      this.addform = this.config.geSectionForm(this.Product, this.addField);
      this.isEdit = false;
      this.data.loading = true;
      this.addProd = true;
      this.data.loading = false;
    } else {
      alert("Please login first.");
    }
  }
  editProduct(i) {
    this.Product = JSON.parse(JSON.stringify(this.data.Products[i]));
    this.Stocks = this.data.getStocks(this.Product.sUid);
    this.addProd = true;
    this.addImg = true;
    if (!Array.isArray(this.Product.aSizeList)) {
      this.Product.aSizeList = [];
    }
    this.addField = this.config.setAddFieldForm();
    this.addform = this.config.geSectionForm(this.Product, this.addField);
    this.isEdit = true;
    this.selectedProduct = i;
  }
  saveNewProd() {
    if (this.data.Users.uid != null && this.data.Users.uid != undefined && this.data.Users.uid != "") {
      this.addProd = false;
      this.config.setData(this.addField, this.Product, this.addform.value);
      this.Product.dDiscountPercent = (((Number(this.Product.dPrice) - Number(this.Product.dDiscountPrice)) / Number(this.Product.dPrice)) * 100).toFixed(2);
      if (Array.isArray(this.data.Products) && !this.isEdit) {
        this.data.Products.push(JSON.parse(JSON.stringify(this.Product)));
      } else if (Array.isArray(this.data.Products) && this.selectedProduct >= 0 && this.data.Products[this.selectedProduct]) {
        this.data.Products[this.selectedProduct] = JSON.parse(JSON.stringify(this.Product));
      }
      this.data.updateProductDetails(this.Product);
      this.isEdit = false;
      this.Product = JSON.parse(JSON.stringify(this.data.getProduct()));
    } else {
      alert("Please fill basic information in my-info section.");
    }
  }
  back() {
    this.addProd = false;
    this.isEdit = false;
  }
  validate() {
    let i = 1;
    let tempObj = [];
    if (Array.isArray(this.data.Products)) {
      i = this.data.Products.length + 1;
    }
    this.Product.sUid = "AREP" + this.addform.controls["ProdName"].value + this.addform.controls["Category"].value;
    this.Product.sUid = this.Product.sUid.replace(/[^a-zA-Z0-9]+/g, "");
    if (Array.isArray(this.data.Products)) {
      tempObj = this.data.Products.filter(obj => obj.sName === this.addform.controls["ProdName"].value && obj.sCategory === this.addform.controls["Category"].value);
    }
    if (tempObj.length === 0) {
      this.addImg = true;
    }
  }
  addImage($event, image, ind) {
    if (this.data.Users.uid != null && this.data.Users.uid != undefined && this.data.Users.uid != "") {
      image.uid = this.Product.sUid + "-img-00" + ind.toString();
      this.storage.uploadFile($event.target.files[0], image);
    } else {
      alert("Please fill basic information in my-info section.");
    }
  }
  deleteProduct(ind) {
    if (this.data.Users.uid != null && this.data.Users.uid != undefined && this.data.Users.uid != "") {
      this.data.deleteProductDetails(this.data.Products[ind]);
      this.data.Products.splice(ind, 1);
    } else {
      alert("Please fill basic information in my-info section.");
    }

  }
  addImgetoProd() {
    this.Product.aImages.push({
      "downloadURL": "../assets/images/upload.jpg",
      "state": "",
      "variant": "",
      "uid": ""
    })
  }
  addStock(content) {
    let tempObj = JSON.parse(JSON.stringify(this.data.Stock));
    tempObj.oDest = JSON.parse(JSON.stringify(this.data.addrObj));
    tempObj.oSource = JSON.parse(JSON.stringify(this.data.addrObj));
    tempObj.dtDate = new Date();
    tempObj.sAction = "Add";
    tempObj.sProductId = this.Product.sUid;
    this.stockform = this.config.geSectionForm(tempObj, this.stockField);
    this.stockRecform = this.config.geSectionForm(tempObj.oSource, this.addrField);
    this.stockDelform = this.config.geSectionForm(tempObj.oDest, this.addrField);
    this.Stocks.push(tempObj);
    this.selectedStock = this.Stocks.length - 1;
    this.openPopup(content)
  }
  SaveStock() {
    this.config.setData(this.addrField, this.Stocks[this.selectedStock].oDest, this.stockDelform.value);
    this.config.setData(this.addrField, this.Stocks[this.selectedStock].oSource, this.stockRecform.value);
    this.config.setData(this.stockField, this.Stocks[this.selectedStock], this.stockform.value);
    this.modalRef.close();
    if (isNaN(this.Product.dStockAvailable)) {
      this.Product.dStockAvailable = 0;
    };
    let totalStock = this.Product.dStockAvailable + this.Stocks[this.selectedStock].dQuantity
    this.addform.controls["Stock"].setValue(totalStock);
    this.data.updateStockDetails(this.Stocks[this.selectedStock]);
  }
  openPopup(newContents) {
    this.modalRef = this.modalService.open(newContents, { windowClass: 'buss-modal' });
  }
  downloadMaster() {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.Stocks);
    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'sheet1');

    /* save to file */
    XLSX.writeFile(wb, this.Product.sUid + '.xlsx');

  }
  downloadProductList() {
    let downLoadObj = []
    let keys = this.config.getInventoryUpdateFileConfig();
    this.data.Products.forEach(product => {
      let tempObj = {};
      keys.forEach(element => {
        tempObj[element.sHeaderName] = product[element.sMapping];
      });
      downLoadObj.push(tempObj);
    });
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(downLoadObj);
    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'sheet1');

    /* save to file */
    XLSX.writeFile(wb, "ProductList" + '.xlsx');
  }
  sortTable(dataTable, key) {
    if (dataTable == "ProductList") {
      if (this.dir == 'asc') {
        this.data.Products = _.sortBy(this.data.Products, key).reverse();
        this.dir = 'dsc'
      } else {
        this.data.Products = _.sortBy(this.data.Products, key);
        this.dir = 'asc'
      }
    } else if (dataTable == 'Stock') {
      if (this.dir == 'asc') {
        this.Stocks = _.sortBy(this.Stocks, key).reverse();
        this.dir = 'dsc'
      } else {
        this.Stocks = _.sortBy(this.Stocks, key);
        this.dir = 'asc'
      }
    }
  }
  addSize() {
    this.Product.aSizeList.push(JSON.parse(JSON.stringify(this.data.sizeListObj)));
  }
  deleteSize(ind) {
    this.Product.aSizeList.splice(ind, 1);
  }
  readExcelFile(file: any) {
    let fileReader = new FileReader();
    fileReader.onload = (e) => {
      this.excelBuffer = fileReader.result;
      var data = new Uint8Array(this.excelBuffer);
      var arr = new Array();
      for (var i = 0; i != data.length; i++) {
        arr[i] = String.fromCharCode(data[i]);
      }
      var bstr = arr.join("");
      var workbook = XLSX.read(bstr, { type: 'binary' });
      var first_sheet_name = workbook.SheetNames[0];
      var worksheet = workbook.Sheets[first_sheet_name];
      let xlsData = XLSX.utils.sheet_to_json(worksheet, { raw: true, header: 1 });
      let filekeys = this.config.getInventoryUpdateFileConfig();
      let result = []
      xlsData.forEach((element, ind) => {
        let tempObj = JSON.parse(JSON.stringify(this.data.Product));
        if (ind != 0) {
          filekeys.forEach((innerElement, ind1) => {
            if (element[ind1]) {
              tempObj[innerElement.sMapping] = element[ind1].toString();
            } else {
              tempObj[innerElement.sMapping] = "";
            }
          });
          tempObj.sUid = "AREP" + tempObj.sName + tempObj.sCategory;
          tempObj.sUid = tempObj.sUid.replace(/[^a-zA-Z0-9]+/g, "");
          let prevObj = this.data.Products.filter(obj => obj.sUid == tempObj.sUid);
          if (prevObj.length > 0) {
            tempObj.dStockAvailable = prevObj[0].dStockAvailable;
            tempObj.dStockSold = prevObj[0].dStockSold;
            tempObj.dStockDemand = prevObj[0].dStockDemand;
            tempObj.dInCart = prevObj[0].dInCart;
            tempObj.aImages = prevObj[0].aImages;
          }
          tempObj.dDiscountPercent = (((Number(tempObj.dPrice) - Number(tempObj.dDiscountPrice)) / Number(tempObj.dPrice)) * 100).toFixed(2);
          result.push(tempObj);
          this.data.updateProductDetails(tempObj);
        }
      });
      this.modalRef.close();
    }
    fileReader.readAsArrayBuffer(file);
  }
  uploadFile(importEvent: any): void {
    let files = importEvent.target.files;
    let file = files[0];
    this.readExcelFile(file);
  }
}
