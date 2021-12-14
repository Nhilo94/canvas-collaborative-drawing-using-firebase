import { Injectable, NgZone } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';

/* tiers */
import firebase from 'firebase/compat/app';
import { tap } from 'rxjs/operators';
import { User } from '../model/interfaces/user';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private userData: any;
  constructor(
    public firestore: AngularFirestore,
    public authfire: AngularFireAuth,
    private router: Router,
    public ngZone: NgZone
  ) {
    this.saveUserLocal().subscribe();
  }

  // Returns true when user is looged in and email is verified
  get isLoggedIn(): boolean {
    return localStorage.getItem('user') ? true : false;
  }

  // Sign in with Google
  GoogleAuth() {
    return this.AuthLogin(new firebase.auth.GoogleAuthProvider());
  }

  // Auth logic to run auth providers
  AuthLogin(provider: any) {
    return this.authfire
      .signInWithPopup(provider)
      .then((result) => {
        this.ngZone.run(() => {
          this.saveUserLocal().subscribe(() => {
            this.router.navigate(['/p-canvas']);
          });
        });
        this.SetUserData(result.user);
      })
      .catch((error) => {
        console.log(error);
        window.alert(error);
      });
  }

  /* Store user data in localstorage */
  SetUserData(user: any) {
    const userRef: AngularFirestoreDocument<any> = this.firestore.doc(
      `users/${user.uid}`
    );
    const userData: User = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified,
    };
    return userRef.set(userData, {
      merge: true,
    });
  }

  // Sign out
  SignOut() {
    return this.authfire.signOut().then(() => {
      localStorage.clear();
      this.router.navigate(['/auth0']);
    });
  }

  // Save user logged in local
  saveUserLocal() {
    return this.authfire.authState.pipe(
      tap((user: any) => {
        if (user) {
          this.userData = user;
          localStorage.setItem('user', JSON.stringify(this.userData));
        } else {
          localStorage.removeItem('user');
        }
      })
    );
  }
}
