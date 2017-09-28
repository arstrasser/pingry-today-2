import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Storage } from '@ionic/storage';
import localForage from "localforage";

import { Events } from 'ionic-angular';

//import { FeedParseProvider } from '../feed-parse/feed-parse';
//import { DateFunctionsProvider } from '../date-functions/date-functions';


/*
  Generated class for the ScheduleProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class MyScheduleProvider {
  myClasses:any/*{block:Array<any>, flex:Array<any>, CP:Array<any>}*/ = {"block":[], "flex":[], "CP":[]};;
  modified:boolean = false;
  constructor(public http: Http, public events:Events, public storage:Storage) {
    localForage.config({
      name        : 'lf',
      storeName   : 'keyvaluepairs', // Should be alphanumeric, with underscores.
    });
    //localForage.setItem("myClasses", JSON.parse('{"block":[{"name":"Test","color":"#EE9A00","type":"block","firstLunch":true,"takesFlex":false,"firstFlex":true,"timeType":"","time":{"day":"","id":"4"},"tasks":[]},{"name":"Test 2","color":"#fff","type":"block","firstLunch":false,"takesFlex":true,"firstFlex":true,"timeType":"","time":{"day":"","id":"2"},"tasks":[]}],"flex":[],"CP":[]}'))
    //For old versions of the app
    localForage.getItem("myClasses").then(a => {
      const b:any = a; //Weird bug to satisfy typescript
      if(b){
        console.log("Restoring classes from LocalForage");
        this.myClasses = b;
        this.save();
        this.events.publish("myClassesReady");
        localForage.setItem("myClasses", null);
      }
    })

    //Typical Refreshing
    this.storage.get("myClasses").then(val => {
      if(val){

        //Correct old science classes
        for(let i = 0; i < val.block.length; i++){
          if(val.block[i].takesFlex !== "" && val.block[i].takesFlex !== "both" && val.block[i].takesFlex !== "before" && val.block[i].takesFlex !== "after" && val.block[i].takesFlex !== "cp"){
            if(val.block[i].takesFlex){
              val.block[i].takesFlex = "both";
            }else{
              val.block[i].takesFlex = "";
            }
          }
          console.log(val.block[i]);
        }
        console.log(val);
        this.myClasses = val;
        this.events.publish("myClassesReady");
      }
    });
  }

  setChanged(val){
    this.modified = val; //Modifier for whether or not user classes were updated
  }

  getAll(){
    return this.myClasses; //returns all classes
  }

  getAllType(id){
    return this.myClasses[id]; //returns all classes of type "id"
  }

  get(type, time){
    //Iterate through all classes of type "type" for one that matches the given time
    for(var i = 0; i < this.myClasses[type].length; i++){
      if(this.myClasses[type][i].time.id == time){
        return this.myClasses[type][i];
      }
    }
    return undefined; //Returns undefined if it couldn't find a class
  }

  set(type, cls){
    for(var i = 0; i < this.myClasses[type].length; i++){
      if(cls.time == this.myClasses[type][i].time){
        this.myClasses[type][i] = cls;
        return cls;
      }
    }
    this.myClasses[type].push(cls);
    return cls;
  }
  removeClass(type, cls){
    for(var i = 0; i < this.myClasses[type].length; i++){
      if(cls == this.myClasses[type][i]){
        this.myClasses[type].splice(i,1);
        return true;
      }
    }
    return false;
  }
  removeClassById(type, id){
    this.myClasses[type].splice(id,1);
  }
  addClass(cls){
    console.log(cls);
    this.myClasses[cls.type].push(cls);
  }
  addClassWithType(type, cls){
    //Deprecated function to add a class to a specific place
    console.warn("Add Class with Type is deprecated, please use Add Class");
    this.myClasses[type].push(cls);
  }

  save(){
    this.storage.set("myClasses", this.myClasses);
    this.modified = true;
  }
}
