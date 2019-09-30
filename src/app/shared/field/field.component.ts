import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { take, takeUntil } from 'rxjs/operators';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Subject } from 'rxjs/Subject';
import * as _ from 'underscore';
@Component({
  selector: 'app-field',
  templateUrl: './field.component.html',
  styleUrls: ['./field.component.scss']
})
export class FieldComponent implements OnInit {
  @Input() field: any;
  @Input() form: FormGroup;
  searchArray: any = [];
  private _onDestroy = new Subject<void>();
  constructor() { }

  ngOnInit() {
    if (this.field.fieldType === 'Search DropDown') {
      this.setInitialValue();
      this.form.controls[this.field.sFieldName].valueChanges
        .pipe(takeUntil(this._onDestroy))
        .subscribe(() => {
          this.filterBanks();
        });
    }
  }
  get isValid() { return this.form.controls[this.field.sFieldName].valid; }

  setVal(event) {
    this.form.controls[this.field.sFieldName].setValue(event);
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  setInitialValue() {
    this.field.searchArray = JSON.parse(JSON.stringify(this.field.optionArray));
  }

  filterBanks() {
    this.searchArray = []
    if (!this.field.optionArray) {
      return;
    }
    let search = this.form.controls[this.field.sFieldName].value;
    this.field.optionArray.forEach(element => {
      let branchName = element.viewValue.toLowerCase();
      let cmpName = search.toLowerCase();
      if (branchName.includes(cmpName)) {
        this.searchArray.push(element);
      }
    });
    var branchObj = _.findWhere(this.searchArray, { "viewValue": search });
    if (branchObj != undefined) {
      this.form.controls[this.field.sFieldName].setValue(branchObj.value);
    }
  }

}
