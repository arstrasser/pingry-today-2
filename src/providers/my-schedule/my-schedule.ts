import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Rx';

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
  myClasses:{block:Array<any>, flex:Array<any>, CP:Array<any>} = {"block":[], "flex":[], "CP":[]};;
  modified:boolean = false;
  constructor(public http: Http, public events:Events) {
    this.reload();
  }

  reload(){
    let temp = localStorage.getItem("myClasses");
    if(temp != null){
      this.myClasses = JSON.parse(temp);
    }else{
      localStorage.setItem("myClasses", JSON.stringify(this.myClasses));
    }
    //If invalid storage or myClasses
    if(!!this.myClasses && !!this.myClasses.block){

      //$localForage.setItem("myClasses", myClasses);
    }else{
      /*$localForage.getItem("myClasses").then(function(value){
        if(value != null){
          myClasses = value;
        }
      })*/
    }
  }

  setChanged(val){
    this.modified = val; //Modifier for whether or not user classes were updated
  }

  load(){
    this.reload();
    this.modified = true;
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
    //$localForage.setItem("myClasses", myClasses);
    localStorage.setItem("myClasses", JSON.stringify(this.myClasses));
    this.modified = true;
  }
}
