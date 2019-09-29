import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DataService } from '../../services/data.service';
import { ConfigService } from '../../services/config.service';
@Component({
  selector: 'app-my-details',
  templateUrl: './my-details.component.html',
  styleUrls: ['./my-details.component.scss']
})
export class MyDetailsComponent implements OnInit {
  basicField: any = [];
  addrField: any = [];
  form: FormGroup;
  addrForm: any = [];
  userData;
  constructor(public data: DataService,
    private config: ConfigService) {
    this.userData = this.data.Users;
    if (!Array.isArray(this.userData.aAddress)) {
      this.userData.aAddress = [];
    }
    this.setDataField();
  }

  ngOnInit() {
  }
  setDataField() {
    this.basicField = this.config.setBasicDatField();
    this.addrField = this.config.setAddrFields();
    this.form = this.config.geSectionForm(this.userData, this.basicField);
    this.userData.aAddress.forEach(element => {
      let tempForm = this.config.geSectionForm(element, this.addrField);
      this.addrForm.push(tempForm);
    });
  }
  setAddrType(type, i) {
    this.userData.aAddress[i].sType = type;
  }
  save() {
    this.config.setData(this.basicField, this.userData, this.form.value);
    this.userData.aAddress.forEach((element, ind) => {
      this.config.setData(this.addrField, element, this.addrForm[ind].value);
    });
    this.userData.uid = this.userData.sPhoneNumber;
    this.data.updateUserDetls(this.userData);

  }
  addAddr() {
    this.userData.aAddress.push(JSON.parse(JSON.stringify(this.data.addrObj)));
    let tempForm = this.config.geSectionForm(this.userData.aAddress[this.userData.aAddress.length - 1], this.addrField);
    this.addrForm.push(tempForm);
  }
  rmAddr(i) {
    this.userData.aAddress.splice(i, 1);
    this.addrForm.splice(i, 1);
  }
}
