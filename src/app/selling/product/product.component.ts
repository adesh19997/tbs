import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';
import { StorageService } from '../../services/storage.service';
import { AuthenticateService } from '../../services/authenticate.service';
import { Router } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
  providers: [CurrencyPipe]
})
export class ProductComponent implements OnInit {

  constructor( public data: DataService,
    public storage: StorageService,
    public user: AuthenticateService,
    private router: Router) { }

  ngOnInit() {
    
  }

  gotoView(ind){
    this.data.Product = this.data.Products[ind];
    this.router.navigate(['products/view']);
  }
}
