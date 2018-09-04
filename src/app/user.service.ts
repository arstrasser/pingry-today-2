import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { Events } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { MessagesService } from './messages.service';
import { SettingsService } from './settings.service'
import { map } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  accessToken:string = "D7eheWtTHox3Equ6TvAspzfyzW84DNzng27vfib2";
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
    return this.accessToken == "";
  }

  logout(){
    this.accessToken = "";
    localStorage.setItem("accessToken", this.accessToken);
  }

  submitCode(code){
    return new Promise((resolve, reject) => {
      if(!this.settings.apiKey) reject("No accessToken");
      this.http.get("https://compsci.pingry.k12.nj.us:3001/v1/user/addPrideEvent?apiKey="+this.settings.apiKey+"&accessToken="+this.accessToken+"&code="+code).pipe(map(res => res.json())).subscribe((res) => {
        resolve();
      }, (err) => this.errorHandler(err, reject));
    });
  }

  login(username, password){
    return new Promise((resolve, reject) => {
      if(username.indexOf("@") == -1){
        username += "@pingry.org";
      }
      this.http.get("https://compsci.pingry.k12.nj.us:3001/v1/user/accessToken?apiKey="+this.settings.apiKey+"&username="+username+"&password="+password).pipe(map(res => res.json())).subscribe((res) => {
        this.accessToken = res;
        localStorage.setItem("accessToken", res);
        resolve();
      }, (err) => reject(err));
    });
  }

  getPrideLeaderboard(){
    return new Promise((resolve, reject) => {
      if(!this.settings.apiKey) reject("No accessToken");
      this.http.get("https://compsci.pingry.k12.nj.us:3001/v1/pride/leaderboard?apiKey="+this.settings.apiKey+"&accessToken="+this.accessToken).pipe(map(res => res.json())).subscribe((res) => {
        resolve(JSON.parse(res));
      }, (err) => this.errorHandler(err, reject));
    });
  }

  getUserPoints(){
    return new Promise((resolve, reject) => {
      if(!this.settings.apiKey) reject("No accessToken");
      this.http.get("https://compsci.pingry.k12.nj.us:3001/v1/user/pride_points?apiKey="+this.settings.apiKey+"&accessToken="+this.accessToken).pipe(map(res => res.json())).subscribe((res:number) => {
        resolve(res);
      }, (err) => this.errorHandler(err, reject));
    });
  }

  errorHandler(err, rej){
    if(err.status == 401){
      this.logout();
      this.messages.showError("Sorry, you have been logged out...");
    }
    rej(err);
  }
}
