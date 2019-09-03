import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
@Injectable()
export class DataService {
  Users = {
    Email: "",
    Name: "",
    phoneNumber: "",
    userImg: "",
    orders: {
      order1: {
        amount: "",
        currentStatus: "",
        deliveryAddress: [],
        deliveryDate: null,
        orderDate: null,
        productName: ""
      }
    }
  }
  Product = {
    uid: "",
    images: [{
      "downloadURL": "../assets/images/upload.jpg",
      "state": "",
      "variant": "",
      "uid": ""
    }],
    name: "",
    category: "",
    subCategory: [],
    otherParams: [],
    price: null,
    stock: null,
    variants: [],
    reviews: [
      {
        reviewerName: "",
        reviewDate: null,
        reviewComment: "",
        rating: null
      }
    ],
    avgrating: null
  }
  Products: any;
  Master: any;
  loading: any = false;
  constructor(private db: AngularFireDatabase) {
  }

  updateUserDetls(user) {
    let temp = this.db.object("/Users/" + user.uid);
    temp.valueChanges().subscribe(data => {
      if (!data) {
        this.Users.Email = user.Email;
        this.Users.phoneNumber = user.phoneNumber;
        this.Users.userImg = user.userImg;
        this.Users.Name = user.userName;
        this.db.object("/Users/" + user.uid).update(user);
      }
    })
  }
  updateProductDetails(product) {
    this.db.object("/Products/" + product.uid).update(product);
  }
  deleteProductDetails(product) {
    this.db.object("/Products/" + product.uid).remove();
  }
  getProducts() {
    let temp = this.db.list("/Products");
    temp.valueChanges().subscribe(data => {
      this.Products = data;
    });
  }
  getMaster() {
    let temp = this.db.object("/Masters");
    temp.valueChanges().subscribe(data => {
      this.Master = data;
      this.loading =false;
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

