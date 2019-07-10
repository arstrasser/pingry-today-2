import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { Events } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { MessagesService } from './messages.service';
import { SettingsService } from './settings.service'

@Injectable({
  providedIn: 'root'
})
export class UserService {
  //The user's access token for their data
  accessToken:string = "";
  constructor(private http:Http, private storage:Storage, private events: Events,
     private settings:SettingsService, private messages:MessagesService) {
    this.storage.get("accessToken").then(val => {
      if(val){
        this.accessToken = val;
        this.events.publish("User Loaded");
      }
    })
  }

  isLoggedIn(){
    return this.accessToken != "";
  }

  logout(){
    this.accessToken = "";
    this.storage.set("accessToken", this.accessToken);
  }

  //Submit a pride event code
  submitCode(code){
    return new Promise((resolve, reject) => {
      if(!this.settings.apiKey) return reject("No API key");
      if(!this.accessToken) return reject("No accessToken");
      this.http.get("https://pingrytoday.pingry.org/v1/user/addPrideEvent?api_key="+this.settings.apiKey+"&accessToken="+this.accessToken+"&code="+code).subscribe((res) => {
        resolve();
      }, (err) => this.errorHandler(err, reject));
    });
  }

  //Login with a username and password
  login(username, password){
    return new Promise((resolve, reject) => {
      if(username.indexOf("@") == -1){
        username += "@pingry.org";
      }
      this.http.get("https://pingrytoday.pingry.org/v1/user/accessToken?api_key="+this.settings.apiKey+"&username="+username+"&password="+password).subscribe((res) => {
        this.accessToken = res.json();
        this.storage.set("accessToken", this.accessToken);
        resolve();
      }, (err) => reject(err));
    });
  }

  //Gets the pride leaderboard
  getPrideLeaderboard(){
    return new Promise((resolve, reject) => {
      if(!this.settings.apiKey) return reject("No API key");
      this.http.get("https://pingrytoday.pingry.org/v1/pride/leaderboard?api_key="+this.settings.apiKey+"&accessToken="+this.accessToken).subscribe((res) => {
        resolve(res.json());
      }, (err) => this.errorHandler(err, reject));
    });
  }

  //Gets how many pride points the user has
  getUserPoints(){
    return new Promise((resolve, reject) => {
      if(!this.settings.apiKey) return reject("No API key");
      if(!this.accessToken) return reject("No accessToken");
      this.http.get("https://pingrytoday.pingry.org/v1/user/pride_points?api_key="+this.settings.apiKey+"&accessToken="+this.accessToken).subscribe((res) => {
        resolve(res.json());
      }, (err) => this.errorHandler(err, reject));
    });
  }

  errorHandler(err, rej){
    //If you're unauthorized (HTTP error 401), the access token is probably invalid and we should force a new log in.
    if(err.status == 401){
      this.logout();
      this.messages.showError("Sorry, you have been logged out...");
    }
    rej(err);
  }
}
