import { Component, OnInit } from '@angular/core';
import { ConfigService } from '../services/config.service';
import { DataService } from '../services/data.service';
import { StorageService } from '../services/storage.service';
import { AuthenticateService } from '../services/authenticate.service';
import { FormGroup } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs/Subject';
@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.scss'],
  providers: []
})
export class InventoryComponent implements OnInit {
  field: any = [];
  form: FormGroup;
  addField: any = [];
  addform: FormGroup;
  Products: any;
  addProd: boolean = false;
  Product: any;
  addImg: boolean = false;
  currUser: any;
  isEdit: boolean = false;
  compData = {
    selectedCat:"",
    selectedSubCat:""
  }
  private _onDestroy = new Subject<void>();
  constructor(private config: ConfigService,
    public data: DataService,
    public storage: StorageService,
    public user: AuthenticateService) {
    this.field = this.config.setInventoryFields();
    this.form = this.config.geSectionForm(this.compData,this.field);
  }

  ngOnInit() {
    this.Products = this.data.Products;
    this.currUser = this.data.Users;
  }
  addProduct() {
    if (this.currUser.verified) {
      this.Product = this.data.getProduct();
      this.addField = this.config.setAddFieldForm();
      this.addform = this.config.geSectionForm(this.Product,this.addField);
      this.data.loading = true;
      this.addProd = true;
      this.data.loading = false;
    }
  }
  editProduct(i) {
    this.Product = this.data.Products[i];
    this.addProd = true;
    this.addImg = true;
    this.addField = this.config.setAddFieldForm();
    this.addform = this.config.geSectionForm(this.Product,this.addField);
    this.isEdit = true;
  }
  saveNewProd() {
    this.addProd = false;
    this.config.setData(this.addField, this.Product, this.addform.value);
    if (Array.isArray(this.data.Products) && !this.isEdit) {
      this.data.Products.push(this.Product);
    } else {
      this.data.Products = [this.Product];
    }
    this.data.updateProductDetails(this.Product);
    this.isEdit =false;
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
    image.uid = this.Product.uid + "img" + ind.toString();
    this.storage.uploadFile($event.target.files[0], image);
  }
  deleteProduct(ind) {
    this.data.deleteProductDetails(this.data.Products[ind]);
    this.data.Products.splice(ind, 1);

  }
  addImgetoProd() {
    this.Product.aImages.push({
      "downloadURL": "../assets/images/upload.jpg",
      "state": "",
      "variant": "",
      "uid": ""
    })
  }
}
