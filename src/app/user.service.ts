import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { Events } from '@ionic/angular';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  accessToken:string = "";
  constructor(private http:Http, private storage:Storage, private events: Events) {
    this.storage.get("accessToken").then(val => {
      if(val){

        this.events.publish("User Loaded");
      }
    })
  }

  getUserInfo(){

  }

  submitCode(code, callback){

  }

  login(username, password, callback){
    this.http.get("https://compsci.pingry.k12.nj.us:3001")

    return false;
  }

  getUserPoints(){

  }
}
