import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Events } from 'ionic-angular';
import 'rxjs/add/operator/map';


@Injectable()
export class SettingsProvider {
  public apiKey:string = "rpuChVS3LdQR2qcFSaV0NIxcWm5Q0ep4NInfQRvu";
  athleticMaps:boolean;
  athleticSubscription:string;
  athleticCalendars:string[] = [];
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

    temp = localStorage.getItem("athleticSubscription");
    if(temp == "" || temp == undefined){
      this.athleticSubscription = "";
    }else{
      this.athleticSubscription = temp;
    }

    temp = localStorage.getItem("ddd");
    if(temp != "" && temp != undefined){
      this.ddd = JSON.parse(temp);
    }
    this.refresh();
  }

  refresh(){
    this.http.get("http://compsci.pingry.k12.nj.us:3000/ddd?api_key="+this.apiKey).map(data => data.json()).subscribe(data => {
      this.ddd = data;
      localStorage.setItem("ddd", JSON.stringify(data));
      this.events.publish("remoteOverrideRefresh");
    })

    this.http.get("http://compsci.pingry.k12.nj.us:3000/athletics/calendarList?api_key="+this.apiKey).map(data => data.json()).subscribe(data => {
      this.athleticCalendars = data;
      localStorage.setItem("athleticCalendars", JSON.stringify(data));
    })
  }

  getAthleticCalendars(){
    return this.athleticCalendars;
  }

  getAthleticSubscription(){
    return this.athleticSubscription;
  }

  setAthleticSubscription(newVal){
    this.athleticSubscription = newVal;
    this.athleticSubscriptionChanged = true;
    localStorage.setItem("athleticSubscription", this.athleticSubscription);
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
