import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import * as firebaseui from 'firebaseui';
import { Observable } from 'rxjs/Observable';
import { DataService } from './data.service';

@Injectable()
export class AuthenticateService {

  public user: Observable<firebase.User>;
  public userDetails: firebase.User = null;
  public fui_auth: any;
  constructor(private _firebaseAuth: AngularFireAuth,
    private data: DataService) {
    this.user = _firebaseAuth.authState;
    this.fui_auth = new firebaseui.auth.AuthUI(this._firebaseAuth.auth);
    this.user.subscribe(
      (user) => {
        if (user) {
          this.userDetails = user;
          if (this.userDetails.emailVerified) {
            this.data.Users.sEmail = this.userDetails.email;
            this.data.Users.verified = true;
            this.data.Users.sPhoneNumber = this.userDetails.phoneNumber;
            this.data.Users.sUserImg = this.userDetails.photoURL;
            this.data.Users.sName = this.userDetails.displayName;
            if (this.data.Users.sPhoneNumber != null && this.data.Users.sPhoneNumber != undefined && this.data.Users.sPhoneNumber != "") {
              this.data.Users.uid = this.data.Users.sPhoneNumber;
              this.data.getUserDetails(this.data.Users.uid);
            } else {
              this.data.getAllUsers(this.data.Users.sEmail);
            }
          }
        }
        else {
          this.userDetails = null;
          this.data.Users.verified = false;
        }
      }
    );
  }
  signInWithGoogle() {
    return this._firebaseAuth.auth.signInWithPopup(
      new firebase.auth.GoogleAuthProvider()
    )
  }
  isLoggedIn() {
    if (this.userDetails == null) {
      return false;
    } else {
      return true;
    }
  }
  logout() {
    this._firebaseAuth.auth.signOut()

  }
}
