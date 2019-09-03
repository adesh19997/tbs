import { Component, OnInit } from '@angular/core';
import { AuthenticateService } from "../services/authenticate.service";
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  showList: boolean = false;
  constructor(private auth: AuthenticateService) {
  }
  userDetls: any
  ngOnInit() {
    this.userDetls = this.auth.loggedInUser
  }

  login() {
    this.auth.signInWithGoogle();
  }
  logout() {
    this.open();
    this.auth.logout();
  }
  open(){
    if(this.showList){
      this.showList = false;
    } else {
      this.showList = true;
    }
  }
}
