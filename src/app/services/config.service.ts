import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DataService } from './data.service';
@Injectable()
export class ConfigService {
  field = {
    "sFieldName": "",
    "sPlaceHolder": "",
    "fieldType": "",
    "optionArray": "",
    "maxlength": "",
    "minlength": "",
    "pattern": "",
    "required": "",
    "maxDate": "",
    "minDate": "",
    "click": "",
    "change": "",
    "style": "",
    "condition": "",
    "disable": "",
    "mapping": "",
    "bDisable": false
  }
  inventoryFields: any = [];
  constructor(private data: DataService) { }
  setInventoryFields() {
    return [{
      "sFieldName": "Category",
      "sPlaceHolder": "Category",
      "fieldType": "Search DropDown",
      "optionArray": this.data.getMasterVal("Category"),
      "maxlength": "",
      "minlength": "",
      "pattern": "",
      "required": "",
      "maxDate": "",
      "minDate": "",
      "click": "",
      "change": "",
      "style": "",
      "condition": "",
      "disable": "",
      "mapping": "",
      "bDisable": false
    },
    {
      "sFieldName": "SubCategory",
      "sPlaceHolder": "Sub Category",
      "fieldType": "Search DropDown",
      "optionArray": this.data.getMasterVal("Sub-Category"),
      "maxlength": "",
      "minlength": "",
      "pattern": "",
      "required": "",
      "maxDate": "",
      "minDate": "",
      "click": "",
      "change": "",
      "style": "",
      "condition": "",
      "disable": "",
      "mapping": "",
      "bDisable": false
    }]
  }
  geSectionForm(data, fields) {
    let group = {};
    fields.forEach(element => {
      var valids = [];
      if (element.required) {
        valids.push(Validators.required);
      }
      if (element.pattern != "") {
        valids.push(Validators.pattern(element.pattern));
      }
      if (element.minlength != "" && element.minlength != null) {
        valids.push(Validators.minLength(element.minLength));
      }
      if (element.maxlength != "" && element.maxlength != null) {
        valids.push(Validators.minLength(element.maxlength));
      }
      group[element.sFieldName] = new FormControl('', valids);
      group[element.sFieldName].value = this.getValue(data, element.mapping);
      if (element.fieldType === "Date" && group[element.sFieldName].value != null) {
        group[element.sFieldName].value = new Date(group[element.sFieldName].value);
      }
      if (element.fieldType === "Date") {
        if (element.maxDate == "current Date") {
          element.maxDate = new Date();
        }
        if (element.minDate == "current Date") {
          element.minDate = new Date();
        }
      }
      if (group[element.sFieldName].value === undefined) {
        if (element.fieldType === "Text") {
          group[element.sFieldName].value = "";
        } else {
          group[element.sFieldName].value = null;
        }
      }
    });
    return new FormGroup(group);
  }
  getValue(data, field) {
    let mapArr = field.split(".");
    if (mapArr.length > 1) {

    } else if (field != undefined && field != null) {

      return data[field];
    }
  }
  setAddFieldForm() {
    return [{
      "sFieldName": "ProdName",
      "sPlaceHolder": "Product Name",
      "fieldType": "Text",
      "optionArray": "",
      "maxlength": "",
      "minlength": "",
      "pattern": "",
      "required": "",
      "maxDate": "",
      "minDate": "",
      "click": "",
      "change": "",
      "style": "",
      "condition": "",
      "disable": "",
      "mapping": "sName",
      "bDisable": false
    },
    {
      "sFieldName": "Category",
      "sPlaceHolder": "Category",
      "fieldType": "Search DropDown",
      "optionArray": this.data.getMasterVal("Sub-Category"),
      "maxlength": "",
      "minlength": "",
      "pattern": "",
      "required": "",
      "maxDate": "",
      "minDate": "",
      "click": "",
      "change": "",
      "style": "",
      "condition": "",
      "disable": "",
      "mapping": "sCategory",
      "bDisable": false
    },
    {
      "sFieldName": "SubCategory",
      "sPlaceHolder": "Sub Category",
      "fieldType": "Search DropDown",
      "optionArray": this.data.getMasterVal("Category"),
      "maxlength": "",
      "minlength": "",
      "pattern": "",
      "required": "",
      "maxDate": "",
      "minDate": "",
      "click": "",
      "change": "",
      "style": "",
      "condition": "",
      "disable": "",
      "mapping": "aSubCategory",
      "mutliple": true,
      "bDisable": false
    },
    {
      "sFieldName": "Brands",
      "sPlaceHolder": "Brands",
      "fieldType": "Search DropDown",
      "optionArray": this.data.getMasterVal("Brands"),
      "maxlength": "",
      "minlength": "",
      "pattern": "",
      "required": "",
      "maxDate": "",
      "minDate": "",
      "click": "",
      "change": "",
      "style": "",
      "condition": "",
      "disable": "",
      "mapping": "aBrands",
      "mutliple": true,
      "bDisable": false
    },
    {
      "sFieldName": "Price",
      "sPlaceHolder": "Price",
      "fieldType": "Number",
      "optionArray": "",
      "maxlength": "",
      "minlength": "",
      "pattern": "",
      "required": "",
      "maxDate": "",
      "minDate": "",
      "click": "",
      "change": "",
      "style": "",
      "condition": "",
      "disable": "",
      "mapping": "dPrice",
      "mutliple": false,
      "bDisable": false
    },
    {
      "sFieldName": "discntPrice",
      "sPlaceHolder": "Discount Price",
      "fieldType": "Number",
      "optionArray": "",
      "maxlength": "",
      "minlength": "",
      "pattern": "",
      "required": "",
      "maxDate": "",
      "minDate": "",
      "click": "",
      "change": "",
      "style": "",
      "condition": "",
      "disable": "",
      "mapping": "dDiscountPrice",
      "mutliple": false,
      "bDisable": false
    },
    {
      "sFieldName": "Stock",
      "sPlaceHolder": "Items in Stock",
      "fieldType": "Number",
      "optionArray": "",
      "maxlength": "",
      "minlength": "",
      "pattern": "",
      "required": "",
      "maxDate": "",
      "minDate": "",
      "click": "",
      "change": "",
      "style": "",
      "condition": "",
      "disable": "",
      "mapping": "dStockAvailable",
      "mutliple": false,
      "bDisable": true
    },
    {
      "sFieldName": "StockSold",
      "sPlaceHolder": "Items Sold",
      "fieldType": "Number",
      "optionArray": "",
      "maxlength": "",
      "minlength": "",
      "pattern": "",
      "required": "",
      "maxDate": "",
      "minDate": "",
      "click": "",
      "change": "",
      "style": "",
      "condition": "",
      "disable": "",
      "mapping": "dStockSold",
      "mutliple": false,
      "bDisable": true
    },
    {
      "sFieldName": "StockCart",
      "sPlaceHolder": "Items in Cart",
      "fieldType": "Number",
      "optionArray": "",
      "maxlength": "",
      "minlength": "",
      "pattern": "",
      "required": "",
      "maxDate": "",
      "minDate": "",
      "click": "",
      "change": "",
      "style": "",
      "condition": "",
      "disable": "",
      "mapping": "dInCart",
      "mutliple": false,
      "bDisable": true
    }]
  }
  setData(field, dataset, formValue) {
    field.forEach(element => {
      dataset[element.mapping] = formValue[element.sFieldName];
    });
  }
  setBasicDatField() {
    return [{
      "sFieldName": "name",
      "sPlaceHolder": "Name",
      "fieldType": "Text",
      "optionArray": "",
      "maxlength": "",
      "minlength": "",
      "pattern": "",
      "required": true,
      "maxDate": "",
      "minDate": "",
      "click": "",
      "change": "",
      "style": "",
      "condition": "",
      "disable": "",
      "mapping": "sName",
      "bDisable": false
    },
    {
      "sFieldName": "email",
      "sPlaceHolder": "Email",
      "fieldType": "Text",
      "optionArray": "",
      "maxlength": "",
      "minlength": "",
      "pattern": "",
      "required": true,
      "maxDate": "",
      "minDate": "",
      "click": "",
      "change": "",
      "style": "",
      "condition": "",
      "disable": "",
      "mapping": "sEmail",
      "bDisable": true
    },
    {
      "sFieldName": "mobile",
      "sPlaceHolder": "Mobile",
      "fieldType": "Text",
      "optionArray": "",
      "maxlength": "",
      "minlength": "",
      "pattern": "",
      "required": true,
      "maxDate": "",
      "minDate": "",
      "click": "",
      "change": "",
      "style": "",
      "condition": "",
      "disable": "",
      "mapping": "sPhoneNumber",
      "bDisable": false
    }]
  }
  setAddrFields() {
    return [
      {
        "sFieldName": "line1",
        "sPlaceHolder": "Building/floor no./flat no.",
        "fieldType": "Text",
        "optionArray": "",
        "maxlength": "",
        "minlength": "",
        "pattern": "",
        "required": true,
        "maxDate": "",
        "minDate": "",
        "click": "",
        "change": "",
        "style": "",
        "condition": "",
        "disable": "",
        "mapping": "sLine1",
        "bDisable": false
      },
      {
        "sFieldName": "line2",
        "sPlaceHolder": "Area",
        "fieldType": "Text",
        "optionArray": "",
        "maxlength": "",
        "minlength": "",
        "pattern": "",
        "required": true,
        "maxDate": "",
        "minDate": "",
        "click": "",
        "change": "",
        "style": "",
        "condition": "",
        "disable": "",
        "mapping": "sLine2",
        "bDisable": false
      },
      {
        "sFieldName": "landmark",
        "sPlaceHolder": "landmark",
        "fieldType": "Text",
        "optionArray": "",
        "maxlength": "",
        "minlength": "",
        "pattern": "",
        "required": true,
        "maxDate": "",
        "minDate": "",
        "click": "",
        "change": "",
        "style": "",
        "condition": "",
        "disable": "",
        "mapping": "sLandmark",
        "bDisable": false
      },
      {
        "sFieldName": "pin",
        "sPlaceHolder": "Pincode",
        "fieldType": "Text",
        "optionArray": "",
        "maxlength": "6",
        "minlength": "",
        "pattern": "",
        "required": true,
        "maxDate": "",
        "minDate": "",
        "click": "",
        "change": "",
        "style": "",
        "condition": "",
        "disable": "",
        "mapping": "sPincode",
        "bDisable": false
      },
      {
        "sFieldName": "city",
        "sPlaceHolder": "City",
        "fieldType": "Text",
        "optionArray": "",
        "maxlength": "",
        "minlength": "",
        "pattern": "",
        "required": true,
        "maxDate": "",
        "minDate": "",
        "click": "",
        "change": "",
        "style": "",
        "condition": "",
        "disable": "",
        "mapping": "sCity",
        "bDisable": false
      },
      {
        "sFieldName": "state",
        "sPlaceHolder": "State",
        "fieldType": "Text",
        "optionArray": "",
        "maxlength": "",
        "minlength": "",
        "pattern": "",
        "required": true,
        "maxDate": "",
        "minDate": "",
        "click": "",
        "change": "",
        "style": "",
        "condition": "",
        "disable": "",
        "mapping": "sState",
        "bDisable": false
      },
      {
        "sFieldName": "country",
        "sPlaceHolder": "Country",
        "fieldType": "Text",
        "optionArray": "",
        "maxlength": "",
        "minlength": "",
        "pattern": "",
        "required": true,
        "maxDate": "",
        "minDate": "",
        "click": "",
        "change": "",
        "style": "",
        "condition": "",
        "disable": "",
        "mapping": "sCountry",
        "bDisable": false
      }
    ]
  }
}
