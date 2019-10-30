import { Component, OnInit } from '@angular/core';
import { DataService } from "../services/data.service";
import { AuthenticateService } from "../services/authenticate.service";
import { Router } from '@angular/router';
import * as firebase from 'firebase/app';
import * as firebaseui from 'firebaseui';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public firebaseUiAuthConfig: firebaseui.auth.Config = {
    signInFlow: 'popup',
    signInOptions: [
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      {
        requireDisplayName: false,
        provider: firebase.auth.EmailAuthProvider.PROVIDER_ID
      },
      firebase.auth.PhoneAuthProvider.PROVIDER_ID,
    ],
    callbacks: {
      signInSuccessWithAuthResult: function (authResult,) {
        let userDetails = authResult.user;
        this.data.Users.sEmail = userDetails.email;
        this.data.Users.verified = true;
        this.data.Users.sPhoneNumber = userDetails.phoneNumber.replace("+91", "");
        this.data.Users.sUserImg = userDetails.photoURL;
        this.data.Users.sName = userDetails.displayName;
        if (this.data.Users.sPhoneNumber != null && this.data.Users.sPhoneNumber != undefined && this.data.Users.sPhoneNumber != "") {
          this.data.Users.uid = this.data.Users.sPhoneNumber;
          this.data.getUserDetails(this.data.Users.uid);
        } else {
          this.data.getAllUsers(this.data.Users.sEmail);
        }
        this.router.navigate(['/products']);
        return false;
      }.bind(this),

    },
  };
  constructor(public data: DataService,
    private auth: AuthenticateService,
    private router: Router) { }

  ngOnInit() {
    this.auth.fui_auth.start('app-login', this.firebaseUiAuthConfig);
  }

}
