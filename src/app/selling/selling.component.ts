import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { ProductComponent } from '../product/product.component';
@Component({
  selector: 'app-selling',
  templateUrl: './selling.component.html',
  styleUrls: ['./selling.component.scss'],
  providers: [HeaderComponent,ProductComponent]
})
export class SellingComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
