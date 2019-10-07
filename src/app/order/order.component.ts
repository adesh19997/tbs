import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DataService } from '../services/data.service';
import { ConfigService } from '../services/config.service';
import { DatePipe } from '@angular/common';
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import * as XLSX from 'xlsx';
type AOA = any[][];
@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss'],
  providers: [DatePipe]
})
export class OrderComponent implements OnInit {
  public modalRef: any;
  userData: any = {};
  orderField: any = [];
  orderform: FormGroup;
  selectedOrder: any = -1;
  orderTrack: any;
  constructor(public data: DataService,
    private modalService: NgbModal,
    private config: ConfigService) {
    this.data.getOrder();
    this.userData = this.data.Users;
    this.orderField = this.config.setOrderTrackField();
  }

  ngOnInit() {
  }
  openPopup(newContents) {
    this.modalRef = this.modalService.open(newContents, { windowClass: 'buss-modal' });
  }
  editOrderDetl(ind, editOrder) {
    this.selectedOrder = ind;
    this.orderTrack = JSON.parse(JSON.stringify(this.data.orderTrack));
    this.orderform = this.config.geSectionForm(this.orderTrack, this.orderField);
    this.openPopup(editOrder);
  }
  SaveOrder() {
    this.config.setData(this.orderField, this.orderTrack, this.orderform.value);
    this.data.AllOrders[this.selectedOrder].aOrderTrack.push(this.orderTrack);
    this.data.AllOrders[this.selectedOrder].sOrderStatus = this.orderTrack.status;
    this.modalRef.close();
    this.data.updateOrder(this.data.AllOrders[this.selectedOrder]);
  }
  viewOrderTrack(ind, viewTrack) {
    this.selectedOrder = ind;
    this.openPopup(viewTrack);
  }
  downloadMaster() {
    /* generate worksheet */
     const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.data.AllOrders);
    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'sheet1');

    /* save to file */
    XLSX.writeFile(wb, 'Orders.xlsx');

  }
}
