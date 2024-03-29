import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Events } from '@ionic/angular';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  public apiKey:string = "QJxF19F39PV7Lr9qy3sgkXjP8Yx4WNU7CCTDbFXC";
  athleticMaps:boolean;
  athleticSubscriptions:string[] = ["-1"];
  athleticCalendars:Array<{id:number, name:string, url:string}> = [];
  classClickAction:string = "Tasks";
  possibleClassClickActions:string[] = ["Tasks", "Config", "Nothing"];
  extraOptions:Array<string>;
  athleticSubscriptionChanged:boolean = false;
  ddd:any = {};
  pages:Array<{title:string, page?:string, localUrl?:string, systemUrl?:string}> = [];
  possiblePages:Array<{title:string, page?:string, localUrl?:string, systemUrl?:string}> = [
      {title:"Schedule", page:"/schedule"},
      {title:"To Do List", page:"/todo"},
      {title:"News", page:"/news"},
      {title:"Announcements", page:"/announcements"},
      //{title:"Pride Points", page:"/pridePoints"},
      {title:"Athletics", page:"/athletics"},
      {title:"Lunch Menu", systemUrl:"http://www.sagedining.com/menus/pingry"},
      {title:"Photos", systemUrl:"https://www.pingry.org/hp/photos-and-media"},
      {title:"Bookstore", systemUrl:"http://www.pingrybookstore.org"},
      {title:"Web Portal", systemUrl:"https://www.pingry.org/pingrytoday"},
      {title:"Veracross", systemUrl:"https://portals.veracross.com/pingry"},
      {title:"Settings", page:"/settings"},
      {title:"About", page: "/about"}
  ];
  startPageIndex:number = 0; //For now, this is staying at 0 since we always load the first page.

  settingsLoaded:boolean = false;

  constructor(public http: Http, public events: Events, public storage:Storage) {
    this.storage.get("settings").then((val) => {
      if(val){
        //Initialize settings to stored settings
        this.pages = val.pages;
        this.startPageIndex = val.startPageIndex
        this.athleticSubscriptions = val.athleticSubscriptions;
        this.classClickAction = val.classClickAction || "todo";
        this.settingsLoaded = true;
      }else{
        //Set up default settings since couldn't get stored settings
        this.pages = [
          {title:"Schedule", page:"/schedule"},
          {title:"To Do List", page:"/todo"},
          {title:"News", page:"/news"},
          {title:"Announcements", page:"/announcements"},
          //{title:"Pride Points", page:"/pridePoints"},
          {title:"Athletics", page:"/athletics"},
          {title:"Web Portal", systemUrl:"https://www.pingry.org/pingrytoday"},
          {title:"Settings", page:"/settings"},
          {title:"About", page: "/about"}
        ];

        this.saveSettings();
        this.settingsLoaded = true;
      }

      this.events.publish("settingsLoaded");
      this.events.publish("pagesUpdated");
    })

    //Try to get athletic calendars and dress down day schedules from localstorage
    let temp = localStorage.getItem("athleticCalendars");
    if(temp == "" || temp == undefined){
      this.athleticCalendars = [];
    }else{
      this.athleticCalendars = JSON.parse(temp);
    }

    temp = localStorage.getItem("ddd");
    if(temp != "" && temp != undefined){
      this.ddd = JSON.parse(temp);
    }
    this.refresh();
  }

  //Get all the pages and the starting page index.
  getPages():Promise<{pages:{title:string, page?:string, localUrl?:string, systemUrl?:string}[], startPageIndex:number}>{
    return new Promise(resolve => {
      //Returns a promise in case we haven't loaded the settings yet.
      if(this.settingsLoaded){
        return resolve({pages:this.pages, startPageIndex:this.startPageIndex});
      }
      //Add a listener for when they are loaded
      this.events.subscribe("settingsLoaded", () => {
        return resolve({pages:this.pages, startPageIndex:this.startPageIndex});
      })
    })
  }

  //Gets our athletics subscriptions
  getAthleticSubscriptions():Promise<string[]>{
    return new Promise(resolve => {
      if(this.settingsLoaded){
        return resolve(this.athleticSubscriptions);
      }
      this.events.subscribe("settingsLoaded", () => {
        return resolve(this.athleticSubscriptions);
      })
    })
  }

  getClassClickAction():Promise<string>{
    return new Promise(resolve => {
      if(this.settingsLoaded){
        return resolve(this.classClickAction);
      }
      this.events.subscribe("settingsLoaded", () => {
        return resolve(this.classClickAction);
      })
    })
  }

  async setClassClickAction(newAction:string){
    this.classClickAction = newAction;
    return await this.saveSettings();
  }

  async savePages(newPages){
    this.pages = newPages;
    this.startPageIndex;
    this.events.publish("pagesUpdated");
    return await this.saveSettings();
  }

  async setAthleticSubscription(newVal){
    this.athleticSubscriptions = newVal;
    this.athleticSubscriptionChanged = true;
    localStorage.setItem("athleticEventsRefreshTime", "");
    return await this.saveSettings();
  }

  async saveSettings(){
    let v = await this.storage.set("settings", {
      pages:this.pages,
      startPageIndex:this.startPageIndex,
      athleticSubscriptions:this.athleticSubscriptions,
      classClickAction: this.classClickAction
    });
    return v;
  }

  //Refresh data for dress down days and the calendar list
  refresh(){
    this.http.get("https://pingrytoday.pingry.org/v1/ddd?api_key="+this.apiKey).subscribe(data => {
      this.ddd = data.json();
      localStorage.setItem("ddd", JSON.stringify(this.ddd));
      this.events.publish("dddRefresh");
    })

    this.http.get("https://pingrytoday.pingry.org/v1/athletics/calendarList?api_key="+this.apiKey).subscribe(data => {
      this.athleticCalendars = data.json();
      localStorage.setItem("athleticCalendars", JSON.stringify(this.athleticCalendars));
    })
  }

  getAthleticCalendars(){
    return this.athleticCalendars;
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
