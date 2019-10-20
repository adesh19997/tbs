import { Component, OnInit } from '@angular/core';
import { DataService } from "../services/data.service";
import { AuthenticateService } from "../services/authenticate.service";
import { Router } from '@angular/router';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  showList: boolean = false;
  constructor(public data: DataService,
    private auth: AuthenticateService,
    private router: Router) {
  }
  userDetls: any
  ngOnInit() {
    this.data.getConfig();
    this.userDetls = this.data.Users;
  }

  login() {
    this.auth.signInWithGoogle();
  }
  logout() {
    this.open();
    this.auth.logout();
  }
  open() {
    if (this.showList) {
      this.showList = false;
    } else {
      this.showList = true;
    }
  }
  goto(route) {
    this.router.navigate(['products/' + route]);
  }
  home(value) {
    this.data.onlyProduct = value;
    if(value){
      this.data.getProducts();
    }
    this.router.navigate(['/products']);
  }
}
