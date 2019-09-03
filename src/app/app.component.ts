import { Component } from '@angular/core';
import { DataService } from './services/data.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'app';
  mode: any = 'indeterminate';
  value: any = 30;
  constructor(public data: DataService) {

  }
  ngOnInit() {
    this.data.loading = true;
    this.data.getMaster();
    this.data.getProducts();
  
  }
}
