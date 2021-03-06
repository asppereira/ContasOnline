import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import AuthProvider = firebase.auth.AuthProvider;
import { Firebase } from '@ionic-native/firebase';

@Injectable()
export class AuthService {
	private user: firebase.User;

	constructor(public afAuth: AngularFireAuth,public firebaseNative: Firebase) {
		afAuth.authState.subscribe(user => {
			this.user = user;
		});
	}

	getToken(v_platform) {
		
		return this.user.getToken(true);
	}

	signInWithEmail(credentials) {
		console.log('Sign in with email');

		return this.afAuth.auth.signInWithEmailAndPassword(credentials.email,
			 credentials.password);
	}

	signUp(credentials) {
		return this.afAuth.auth.createUserWithEmailAndPassword(credentials.email, credentials.password);
	}

	signOut(): Promise<void> {
		return this.afAuth.auth.signOut();
	}

	signInWithGoogle() {
		console.log('Sign in with google');
		return this.oauthSignIn(new firebase.auth.GoogleAuthProvider());
	}

	signInWithFacebook() {
		console.log('Sign in with facebook');
		return this.oauthSignIn(new firebase.auth.FacebookAuthProvider());
	}

	signInWithTwitter() {
		console.log('Sign in with twitter');
		return this.oauthSignIn(new firebase.auth.TwitterAuthProvider());
	}


	private oauthSignIn(provider: AuthProvider) {
		if (!(<any>window).cordova) {
			return this.afAuth.auth.signInWithPopup(provider);
		} else {
			return this.afAuth.auth.signInWithRedirect(provider)
			.then(() => {
				return this.afAuth.auth.getRedirectResult().then( result => {
					// This gives you a Google Access Token.
					// You can use it to access the Google API.
					let token = result.credential.accessToken;
					// The signed-in user info.
					let user = result.user;
					console.log(token, user);
				}).catch(function(error) {
					// Handle Errors here.
					alert(error.message);
				});
			});
		}
	}


	get authenticated(): boolean {
		return this.user !== null;
	}

	getEmail() {
		return this.user && this.user.email;
	}
	getUid(){
		return this.user && this.user.uid;
	}

}