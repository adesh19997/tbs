import { Component, OnInit } from '@angular/core';
import { ConfigService } from '../services/config.service';
import { DataService } from '../services/data.service';
import { StorageService } from '../services/storage.service';
import { AuthenticateService } from '../services/authenticate.service';
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { FormGroup } from '@angular/forms';
import * as Highcharts from 'highcharts';
import * as XLSX from 'xlsx';
import * as _ from 'underscore';

@Component({
  selector: 'app-finance',
  templateUrl: './finance.component.html',
  styleUrls: ['./finance.component.scss']
})
export class FinanceComponent implements OnInit {
  public modalRef: any;
  fields: any = [];
  form: FormGroup;
  dir: any = "";
  financeObj: any = {};
  highcharts = Highcharts;
  constructor(private config: ConfigService,
    public data: DataService,
    public storage: StorageService,
    private modalService: NgbModal,
    public user: AuthenticateService) {
    this.fields = this.config.setAddFinanceFields();
    this.data.getMonthFinances();
  }

  ngOnInit() {
    
  }
  addFinance(newContents) {
    this.financeObj = JSON.parse(JSON.stringify(this.data.finTransactionObj));
    this.form = this.config.geSectionForm(this.financeObj, this.fields);
    this.openPopup(newContents);
  }
  save() {
    this.config.setData(this.fields, this.financeObj, this.form.value);
    this.data.AllFinances.push(this.financeObj);
    this.data.updateFinanceDetails(this.financeObj);
  }
  sortTable(key) {
    if (this.dir == 'asc') {
      this.data.AllFinances = _.sortBy(this.data.AllOrders, key).reverse();
      this.dir = 'dsc'
    } else {
      this.data.AllFinances = _.sortBy(this.data.AllOrders, key);
      this.dir = 'asc'
    }
  }
  addImage($event) {
    if (this.data.Users.uid != null && this.data.Users.uid != undefined && this.data.Users.uid != "") {
      this.financeObj.uid = this.data.generateTempImageId();
      this.storage.uploadFile($event.target.files[0], this.financeObj);
    } else {
      alert("Please fill basic information in my-info section.");
    }
  }
  uploadFile(ind,content){
    this.financeObj = this.data.AllFinances[ind];
    this.openPopup(content)
  }
  openPopup(newContents) {
    this.modalRef = this.modalService.open(newContents, { windowClass: 'buss-modal' });
  }
  downloadFile(ind){
    this.storage.downloadFile(this.data.AllFinances[ind].downloadURL);
  }
}
