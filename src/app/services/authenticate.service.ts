import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs/Observable';
import { DataService } from './data.service';
@Injectable()
export class AuthenticateService {
  public user: Observable<firebase.User>;
  public userDetails: firebase.User = null;
  public loggedInUser = {
    userName: "",
    email:"",
    verified:false,
    phoneNumber:"",
    userImage:"",
    uid:"",
  }
  constructor(private _firebaseAuth: AngularFireAuth,
    private data: DataService) {
    this.user = _firebaseAuth.authState;
    this.user.subscribe(
      (user) => {
        if (user) {
          this.userDetails = user;
          if(this.userDetails.emailVerified){
            this.loggedInUser.email = this.userDetails.email;
            this.loggedInUser.verified = true;
            this.loggedInUser.phoneNumber = this.userDetails.phoneNumber;
            this.loggedInUser.userImage = this.userDetails.photoURL;
            this.loggedInUser.uid = this.userDetails.uid;
            this.loggedInUser.userName = this.userDetails.displayName;
            this.data.updateUserDetls(this.loggedInUser);
          }
        }
        else {
          this.userDetails = null;
          this.loggedInUser.verified = false;
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
