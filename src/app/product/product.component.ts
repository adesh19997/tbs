import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';
import { StorageService } from '../services/storage.service';
import { AuthenticateService } from '../services/authenticate.service';
@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {

  constructor( public data: DataService,
    public storage: StorageService,
    public user: AuthenticateService) { }

  ngOnInit() {
  }

}
