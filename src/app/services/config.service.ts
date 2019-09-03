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
  geSectionForm(fields) {
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
      group[element.sFieldName].V
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
      "mapping": "name",
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
      "mapping": "category",
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
      "mapping": "subCategory",
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
      "mapping": "price",
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
      "mapping": "stock",
      "mutliple": false,
      "bDisable": false
    }]
  }
  setData(field, dataset, formValue) {
    field.forEach(element => {
      dataset[element.mapping] = formValue[element.sFieldName];
    });
  }
}
