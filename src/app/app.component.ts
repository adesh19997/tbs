import { Component } from '@angular/core';
import { DataService } from './services/data.service';
import { environment } from "../environments/environment";
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
    if (localStorage.getItem("techpixelsVersion")) {
      let currVersion = localStorage.getItem("techpixelsVersion");
      if (environment.version != currVersion) {
        localStorage.setItem("techpixelsVersion", environment.version);
        location.reload(true);
      }
    } else {
      localStorage.setItem("techpixelsVersion", environment.version);
      location.reload(true);
    }

  }
  ngOnInit() {
    this.data.loading = true;
    this.data.getMaster();
    this.data.getOrder();

  }
}
