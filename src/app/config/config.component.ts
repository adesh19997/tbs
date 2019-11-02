import { Component, OnInit } from '@angular/core';
import { ConfigService } from '../services/config.service';
import { DataService } from '../services/data.service';
import { StorageService } from '../services/storage.service';
import { AuthenticateService } from '../services/authenticate.service';
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { FormGroup } from '@angular/forms';
import * as XLSX from 'xlsx';
import * as _ from 'underscore';
type AOA = any[][];

@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.scss']
})
export class ConfigComponent implements OnInit {
  public modalRef: any;
  selectedMaster: any = "";
  aMasterNames: any = [];
  selMaster: any = [];
  selMasterkeys: any = [];
  masterField: any = [];
  masterForm: FormGroup;
  editMasterData: any = {};
  selectedMasterInd: any = -1;
  excelBuffer: any;

  promoField: any = [];
  promoForm: FormGroup;
  editPromoData: any = {};
  selectedPromoInd: any = -1;

  constructor(private config: ConfigService,
    public data: DataService,
    public storage: StorageService,
    private modalService: NgbModal,
    public user: AuthenticateService) {
    this.data.getPromocode();
  }

  ngOnInit() {
    this.aMasterNames = Object.keys(this.data.Master);
    this.promoField = this.config.setPromoCodeFields();
  }
  getMaster(opt) {
    this.selMaster = this.data.getMasterVal(opt);
    this.selMasterkeys = Object.keys(this.selMaster[0]);
  }

  setMasterConfig() {
    this.masterField = [];
    this.selMasterkeys.forEach(element => {
      let field = JSON.parse(JSON.stringify(this.config.field));
      field.mapping = element;
      field.sFieldName = element;
      field.sPlaceHolder = element;
      this.masterField.push(field);
    });
  }
  setPromoConfig() {
    this.promoField = [];
    this.promoField = this.config.setPromoCodeFields();
  }
  addMasterData(masterData) {
    this.setMasterConfig();
    this.editMasterData = {};
    this.selMasterkeys.forEach(element => {
      Object.assign(this.editMasterData, { [element]: "" });
    });
    this.masterForm = this.config.geSectionForm(this.editMasterData, this.masterField);
    this.selectedMasterInd = -1;
    this.openPopup(masterData);
  }
  editMasterDataMethod(ind, masterData) {
    this.editMasterData = this.selMaster[ind];
    this.masterForm = this.config.geSectionForm(this.editMasterData, this.masterField);
    this.selectedMasterInd = ind;
    this.openPopup(masterData);
  }
  deleteMasterData(ind) {
    this.selMaster.splice(ind, 1);
  }

  saveMasterData() {
    this.config.setData(this.masterField, this.editMasterData, this.masterForm.value);
    if (this.selectedMasterInd < 0) {
      this.selMaster.push(this.editMasterData);
    }
    this.selectedMasterInd = -1;
    this.modalRef.close();
  }
  saveMaster() {
    this.data.updateMasterDetls(this.selMaster, this.selectedMaster);
  }
  downloadMaster() {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.selMaster);
    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'sheet1');

    /* save to file */
    XLSX.writeFile(wb, this.selectedMaster + '.xlsx');

  }

  addPromocode(promoData) {
    this.setPromoConfig();
    this.editPromoData = {};
    this.data.promoKeys.forEach(element => {
      Object.assign(this.editPromoData, { [element]: "" });
    });
    this.promoForm = this.config.geSectionForm(this.editPromoData, this.promoField);
    this.selectedPromoInd = -1;
    this.openPopup(promoData);
  }
  editPromocode(ind, promoData) {
    this.editPromoData = this.data.Promocodes[ind];
    this.selectedPromoInd = ind;
    this.promoForm = this.config.geSectionForm(this.editPromoData, this.promoField);
    this.openPopup(promoData);
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
      this.selMasterkeys = xlsData[0];
      this.selMaster = [];
      xlsData.forEach((element, ind) => {
        let tempObj: any = {};
        if (ind != 0) {
          this.selMasterkeys.forEach((innerElement, ind1) => {
            if (element[ind1]) {
              tempObj[innerElement] = element[ind1].toString();
            } else {
              tempObj[innerElement] = "";
            }
          });
          this.selMaster.push(tempObj);
        }
      });
      this.modalRef.close();
    }
    fileReader.readAsArrayBuffer(file);
  }
  uploadMaster(importEvent: any): void {
    let files = importEvent.target.files;
    let file = files[0];
    this.readExcelFile(file);
  }
  openPopup(newContents) {
    this.modalRef = this.modalService.open(newContents, { windowClass: 'buss-modal' });
  }
}
