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
  dir: any = "";
  constructor(private config: ConfigService,
    public data: DataService,
    public storage: StorageService,
    private modalService: NgbModal,
    public user: AuthenticateService) {
    this.field = this.config.setInventoryFields();
    this.form = this.config.geSectionForm(this.compData, this.field);
    this.stockField = this.config.setStockFieldForm();
    this.addrField = this.config.setAddrFields();
  }

  ngOnInit() {
    this.Products = this.data.Products;
    this.currUser = this.data.Users;
    this.data.getAllStocks();
  }
  addProduct() {
    if (this.currUser.verified) {
      this.Stocks = [];
      this.Product = JSON.parse(JSON.stringify(this.data.getProduct()));
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
    this.Product.dStockSold = 0;
    this.Stocks.forEach(element => {
      if (element.sAction == "Sold") {
        this.Product.dStockSold += Number(element.dQuantity);
      }
    });
    this.addProd = true;
    this.addImg = true;
    this.addField = this.config.setAddFieldForm();
    this.addform = this.config.geSectionForm(this.Product, this.addField);
    this.isEdit = true;
    this.selectedProduct = i;
  }
  saveNewProd() {
    if (this.data.Users.uid != null && this.data.Users.uid != undefined && this.data.Users.uid != "") {
      this.addProd = false;
      this.config.setData(this.addField, this.Product, this.addform.value);
      this.Product.dDiscountPercent = (((Number(this.Product.dPrice) -Number(this.Product.dDiscountPrice))/Number(this.Product.dPrice))*100).toFixed(2);
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
    this.Product.sUid = this.addform.controls["ProdName"].value + this.addform.controls["Category"].value + (i).toString();
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
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.data.Products);
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
    } else if(dataTable == 'Stock'){
      if (this.dir == 'asc') {
        this.Stocks = _.sortBy(this.Stocks, key).reverse();
        this.dir = 'dsc'
      } else {
        this.Stocks = _.sortBy(this.Stocks, key);
        this.dir = 'asc'
      }
    }
  }
}
