import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Events } from 'ionic-angular';
import 'rxjs/add/operator/map';


@Injectable()
export class SettingsProvider {
  public apiKey:string = "QJxF19F39PV7Lr9qy3sgkXjP8Yx4WNU7CCTDbFXC";
  athleticMaps:boolean;
  athleticSubscriptions:number[];
  athleticCalendars:Array<{id:number, name:string, url:string}> = [];
  superMode:boolean;
  extraOptions:Array<string>;
  athleticSubscriptionChanged:boolean = false;
  ddd:any = {};

  constructor(public http: Http, public events: Events) {
    let temp = localStorage.getItem("athleticMaps");
    if(temp == "" || temp == undefined || temp == "true"){
      this.athleticMaps = true;
    }else{
      this.athleticMaps = false;
    }

    temp = localStorage.getItem("athleticCalendars");
    if(temp == "" || temp == undefined){
      this.athleticCalendars = [];
    }else{
      this.athleticCalendars = JSON.parse(temp);
    }

    temp = localStorage.getItem("athleticSubscriptions");
    if(temp == "" || temp == undefined){
      this.athleticSubscriptions = [-1];
    }else{
      this.athleticSubscriptions = JSON.parse(temp);
    }

    temp = localStorage.getItem("ddd");
    if(temp != "" && temp != undefined){
      this.ddd = JSON.parse(temp);
    }
    this.refresh();
  }

  refresh(){
    this.http.get("http://compsci.pingry.k12.nj.us:3000/v1/ddd?api_key="+this.apiKey).map(data => data.json()).subscribe(data => {
      this.ddd = data;
      localStorage.setItem("ddd", JSON.stringify(data));
      this.events.publish("dddRefresh");
    })

    this.http.get("http://compsci.pingry.k12.nj.us:3000/v1/athletics/calendarList?api_key="+this.apiKey).map(data => data.json()).subscribe(data => {
      this.athleticCalendars = data;
      localStorage.setItem("athleticCalendars", JSON.stringify(data));
    })
  }

  getAthleticCalendars(){
    return this.athleticCalendars;
  }

  getAthleticSubscriptions(){
    return this.athleticSubscriptions;
  }

  setAthleticSubscription(newVal){
    this.athleticSubscriptions = newVal;
    this.athleticSubscriptionChanged = true;
    localStorage.setItem("athleticSubscriptions", JSON.stringify(this.athleticSubscriptions));
    localStorage.setItem("athleticEvents", null);
    localStorage.setItem("athleticEventsRefreshTime", "");
  }

  getAthleticSubscriptionChanged(){
    return this.athleticSubscriptionChanged;
  }

  setAthleticSubscriptionChanged(val){
    this.athleticSubscriptionChanged = val;
  }

  //Gets whether or not athletic maps are enabled
  getAthleticMaps(){
    return this.athleticMaps;
  }
  //Sets whether or not athletic maps are enabled
  setAthleticMaps(val){
    this.athleticMaps = val;
    if(val){
      localStorage.setItem("athleticMaps", "true");
    }else{
      localStorage.setItem("athleticMaps", "false");
    }
  }
}
