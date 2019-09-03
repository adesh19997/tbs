import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { FieldComponent } from '../field/field.component';
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
  providers: [HeaderComponent, FieldComponent]
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
  private _onDestroy = new Subject<void>();
  constructor(private config: ConfigService,
    public data: DataService,
    public storage: StorageService,
    public user: AuthenticateService) {
    this.field = this.config.setInventoryFields();
    this.form = this.config.geSectionForm(this.field);
    this.addField = this.config.setAddFieldForm();
    this.addform = this.config.geSectionForm(this.addField);
  }

  ngOnInit() {
    this.Products = this.data.Products;
    this.currUser = this.user.loggedInUser;
  }
  addProduct() {
    if (this.currUser.verified) {
      this.addField = this.config.setAddFieldForm();
      this.addform = this.config.geSectionForm(this.addField);
      this.data.loading = true;
      this.Product = this.data.getProduct();
      this.addProd = true;
      this.data.loading = false;
    }
  }
  saveNewProd() {
    this.addProd = false;
    this.config.setData(this.addField, this.Product, this.addform.value);
    if (Array.isArray(this.data.Products)) {
      this.data.Products.push(this.Product);
    } else {
      this.data.Products = [this.Product];
    }
    this.data.updateProductDetails(this.Product);
    this.addField = this.config.setAddFieldForm();
    this.addform = this.config.geSectionForm(this.addField);
  }
  validate() {
    let i = 1;
    let tempObj = [];
    if (Array.isArray(this.data.Products)) {
      i = this.data.Products.length + 1;
    }
    this.Product.uid = this.addform.controls["ProdName"].value + this.addform.controls["Category"].value + (i).toString();
    if (Array.isArray(this.data.Products)) {
      tempObj = this.data.Products.filter(obj => obj.name === this.addform.controls["ProdName"].value && obj.category === this.addform.controls["Category"].value);
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
}
