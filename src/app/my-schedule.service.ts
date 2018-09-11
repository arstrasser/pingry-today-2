import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Storage } from '@ionic/storage';

import { Events } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class MyScheduleService {
  myClasses:any/*{block:Array<any>, flex:Array<any>, CP:Array<any>}*/ = {"block":[], "flex":[], "CP":[]};;
  modified:boolean = false;
  constructor(public http: Http, public events:Events, public storage:Storage) {
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
