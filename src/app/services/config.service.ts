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
      "fieldType": "DropDown",
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
      "fieldType": "DropDown",
      "optionArray": this.data.getMasterVal("Sub-Category"),
      "mutliple": true,
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
  getDataValue(data, field, input) {
    let mapArr = field.split(".");
    if (mapArr.length > 1) {

    } else if (field != undefined && field != null) {
      return data.value = input[field];
    }
  }
  setAddFieldForm() {
    return [
      {
        "sFieldName": "ProdCode",
        "sPlaceHolder": "Product Code",
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
        "mapping": "sUid",
        "bDisable": false
      },
      {
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
        "fieldType": "DropDown",
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
        "mapping": "sCategory",
        "bDisable": false
      },
      {
        "sFieldName": "SubCategory",
        "sPlaceHolder": "Sub Category",
        "fieldType": "DropDown",
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
        "mapping": "aSubCategory",
        "mutliple": true,
        "bDisable": false
      },
      {
        "sFieldName": "Brands",
        "sPlaceHolder": "Brands",
        "fieldType": "DropDown",
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
        "sFieldName": "sShortDesc",
        "sPlaceHolder": "Short Description",
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
        "mapping": "sShortDesc",
        "mutliple": false,
        "bDisable": false
      },
      {
        "sFieldName": "Stock",
        "sPlaceHolder": "Stock Available",
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
        "disable": true,
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
  setStockFieldForm() {
    return [
      {
        "sFieldName": "ProdName",
        "sPlaceHolder": "Product Id",
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
        "mapping": "sProductId",
        "bDisable": false
      },
      {
        "sFieldName": "dQuantity",
        "sPlaceHolder": "Quantity",
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
        "mapping": "dQuantity",
        "bDisable": false
      },
      {
        "sFieldName": "sAction",
        "sPlaceHolder": "Action",
        "fieldType": "DropDown",
        "optionArray": this.data.getMasterVal("Stock-Actions"),
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
        "mapping": "sAction",
        "bDisable": false
      },
      {
        "sFieldName": "sBatchNo",
        "sPlaceHolder": "Batch No",
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
        "mapping": "sBatchNo",
        "bDisable": false
      },
      {
        "sFieldName": "dtExpiryDate",
        "sPlaceHolder": "Expiry Date",
        "fieldType": "Date",
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
        "mapping": "dtExpiryDate",
        "bDisable": false
      }
    ]
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
        "sFieldName": "contactPer",
        "sPlaceHolder": "Contact Person",
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
        "mapping": "sAddrContact",
        "bDisable": false
      },
      {
        "sFieldName": "contactMobile",
        "sPlaceHolder": "Mobile Number",
        "fieldType": "Number",
        "optionArray": "",
        "maxlength": "10",
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
      },
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
  setaddtoCartField() {
    return [{
      "sFieldName": "sQuantity",
      "sPlaceHolder": "Quantity",
      "fieldType": "DropDown",
      "optionArray": this.data.getMasterVal("Quantity"),
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
      "mapping": "sQuantity",
      "bDisable": false
    }]
  }
  setOrderTrackField() {
    return [
      {
        "sFieldName": "sStatus",
        "sPlaceHolder": "Status",
        "fieldType": "DropDown",
        "optionArray": this.data.getMasterVal("Order_Stage"),
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
        "mapping": "status",
        "bDisable": false
      },
      {
        "sFieldName": "sDoneBy",
        "sPlaceHolder": "Updated By",
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
        "mapping": "sDoneBy",
        "bDisable": false
      },
      {
        "sFieldName": "sContact",
        "sPlaceHolder": "Update Person Contact",
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
        "mapping": "sContact",
        "bDisable": false
      }
    ]
  }
  setAnalyticStockField() {
    return [
      {
        PlaceHolder: "Total in Stock",
        value: null,
        mapping: "dTotalStock"
      },
      {
        PlaceHolder: "Total sold",
        value: null,
        mapping: "dTotalSold"
      },
      {
        PlaceHolder: "Total Products",
        value: null,
        mapping: "dTotalProducts"
      },
      {
        PlaceHolder: "Products with Maximum Stock",
        value: [],
        mapping: "aMaxStockProd"
      },
      {
        PlaceHolder: "Products with Minimum Stock",
        value: [],
        mapping: "aMinStockProd"
      },
      {
        PlaceHolder: "Products Sold this Month",
        value: null,
        mapping: "dMonthSale"
      },
      {
        PlaceHolder: "Products Sold this Week",
        value: null,
        mapping: "dWeekSale"
      },
      {
        PlaceHolder: "Products Sold YesterDay",
        value: null,
        mapping: "dDaySale"
      },
      {
        PlaceHolder: "Most Ordered Products",
        value: [],
        mapping: "aMostSold"
      },
      {
        PlaceHolder: "least Ordered Products",
        value: [],
        mapping: "aLeastSold"
      }
    ]
  }
  setAnalyticOrderField() {
    return [
      {
        PlaceHolder: "Orders Placed, Payment Pending",
        value: null,
        mapping: "dOrderPlaced"
      },
      {
        PlaceHolder: "Orders To be Shipped",
        value: null,
        mapping: "dOrderToBeShipped"
      },
      {
        PlaceHolder: "Orders on the Way",
        value: null,
        mapping: "dOrderOnWay"
      },
      {
        PlaceHolder: "Orders out for delivery",
        value: null,
        mapping: "dOrderDelivery"
      },
      {
        PlaceHolder: "Total Orders Delivered",
        value: [],
        mapping: "dOrderDelivered"
      },
      {
        PlaceHolder: "Total Orders Cancelled",
        value: [],
        mapping: "dOrderCancelled"
      },
      {
        PlaceHolder: "Orders Placed this Month",
        value: null,
        mapping: "dOrderMonth"
      },
      {
        PlaceHolder: "Orders Placed this Week",
        value: null,
        mapping: "dOrderWeek"
      },
      {
        PlaceHolder: "Orders Placed YesterDay",
        value: null,
        mapping: "dOrderYesterday"
      }
    ]
  }
  setCreateOffLineOrderFields() {
    return [
      {
        "sFieldName": "custName",
        "sPlaceHolder": "Customer Name",
        "fieldType": "Text",
        "optionArray": [],
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
        "mapping": "sCustName",
        "mutliple": false,
        "bDisable": false
      },
      {
        "sFieldName": "custEmail",
        "sPlaceHolder": "Customer Email",
        "fieldType": "Text",
        "optionArray": [],
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
        "mapping": "sEmail",
        "mutliple": false,
        "bDisable": false
      },
      {
        "sFieldName": "custMob",
        "sPlaceHolder": "Customer Mobile",
        "fieldType": "Text",
        "optionArray": [],
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
        "mapping": "sCustomerId",
        "mutliple": false,
        "bDisable": false
      },
      {
        "sFieldName": "Category",
        "sPlaceHolder": "Category",
        "fieldType": "DropDown",
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
        "mapping": "sCategory",
        "bDisable": false
      },
      {
        "sFieldName": "SubCategory",
        "sPlaceHolder": "Sub Category",
        "fieldType": "DropDown",
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
        "mapping": "aSubCategory",
        "mutliple": true,
        "bDisable": false
      },
      {
        "sFieldName": "Brands",
        "sPlaceHolder": "Brands",
        "fieldType": "DropDown",
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
      }
    ]
  }
}
