import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { forkJoin } from "rxjs";

import { Events } from '@ionic/angular';

import { SettingsService } from './settings.service';
import { MessagesService } from './messages.service';
import { DateFunctionsService } from './date-functions.service';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {
  typeList:Array<{name:string, schedule:any}> = [];
  scheduledDays: any = {};
  manualSchedules: any = {};
  scheduledEvents:{CP:any, CT:any} = {CP: {}, CT:{}};
  curSchedule:Array<any> = [];
  curScheduleName:string = "";
  curDay:Date;
  refreshing:boolean = false;
  constructor(public http: Http, public dfp:DateFunctionsService, public events:Events, public settings:SettingsService, public messages:MessagesService) {
    //Initializes the current day to be the system current day
    this.curDay = new Date();

    //Variable to store all the schedule types
    var temp = localStorage.getItem("typeList");
    if(temp != null){this.typeList = JSON.parse(temp);}

    //CT and CP event schedules
    temp = localStorage.getItem("scheduledEvents");
    if(temp != null){this.scheduledEvents = JSON.parse(temp);}

    //Special Schedule day schedules
    temp = localStorage.getItem("scheduledDays");
    if(temp != null){this.scheduledDays = JSON.parse(temp);}

    //Manual Schedules for Special Schedule days that aren't part of the default set
    temp = localStorage.getItem("manualSchedules");
    if(temp != null){this.manualSchedules = JSON.parse(temp);}

    if(this.typeList.length > 0){
      //Initialize current schedule to be the normal schedule
      this.curSchedule = this.typeList[0].schedule;
      this.curScheduleName = this.typeList[0].name;
    }

    this.refresh();
  }

  refresh(callback?){
    const scheduleURL = "https://pingrytoday.pingry.org:3001/v1/schedule/all?api_key="+this.settings.apiKey;
    const manualURL = "https://pingrytoday.pingry.org:3001/v1/schedule/manual/all?api_key="+this.settings.apiKey;
    const eventsURL = "https://pingrytoday.pingry.org:3001/v1/schedule/events?api_key="+this.settings.apiKey;
    const scheduleTypesURL = "https://pingrytoday.pingry.org:3001/v1/schedule/types?api_key="+this.settings.apiKey;

    this.refreshing = true;
    return forkJoin([
      //Faculty collaboration day schedule refresh
      this.http.get(scheduleURL),
      this.http.get(manualURL),
      this.http.get(eventsURL),
      this.http.get(scheduleTypesURL)
    ]).subscribe((values) =>{
        //Get the special schedules
        this.scheduledDays = values[0].json();
        localStorage.setItem("scheduledDays", JSON.stringify(this.scheduledDays));

        //Get the special manual schedules
        this.manualSchedules = values[1].json();
        localStorage.setItem("manualSchedules", JSON.stringify(this.manualSchedules));

        //Get CP and CT events
        this.scheduledEvents = values[2].json();
        localStorage.setItem("scheduledEvents", JSON.stringify(this.scheduledEvents));

        //Get default schedule configurations
        this.typeList = values[3].json();
        localStorage.setItem("typeList", JSON.stringify(this.typeList));

        console.log(this.typeList);
        if(this.curScheduleName == ""){
          this.curSchedule = this.typeList[0].schedule;
          this.curScheduleName = this.typeList[0].name;
        }

        this.updateCurrentSchedule();
        this.refreshing = false;
        this.events.publish("scheduleRefreshComplete", {success:true});
        if(callback){callback(true)}
        return true;
      }, () => {
        this.refreshing = false;
        this.events.publish("scheduleRefreshComplete", {success:false});
        if(callback){callback(false)}
        return false;
      }
    );
  }

  updateCurrentSchedule() {
    if(this.typeList.length == 0){
      return;
    }
    var d = this.dfp.dateToDayString(this.curDay);
    if(this.scheduledDays && this.scheduledDays[d] != undefined){
      if(this.scheduledDays[d] == "manual"){
        this.curSchedule = this.manualSchedules[d];
        this.curScheduleName = "manual";
        return;
      }
      //Iterate over the schedule types
      for(let i = 0; i < this.typeList.length; i++){
        //if found the respective schedule for the day
        if(this.typeList[i].name == this.scheduledDays[this.dfp.dateToDayString(this.curDay)]){
          this.curSchedule = this.typeList[i].schedule;
          this.curScheduleName = this.typeList[i].name;
          return;
        }
      }
      console.warn("Couldn't find schedule: "+this.scheduledDays[this.dfp.dateToDayString(this.curDay)]);
    }
    //Fallback
    this.curSchedule = this.typeList[0].schedule;
    this.curScheduleName = this.typeList[0].name;
  }

  get(id){
    return this.curSchedule[id];  //returns the current schedule list element of index id
  }

  getCTSchedule(){ //Returns the scheduled activity for community time for the current day
    if(this.scheduledEvents.CT[this.dfp.dateToDayString(this.curDay)] != undefined){
      return this.scheduledEvents.CT[this.dfp.dateToDayString(this.curDay)];
    }
    return "Community Time";
  }

  getCPSchedule(){ //Returns the scheduled activity for conference for the current day
    if(this.scheduledEvents.CP[this.dfp.dateToDayString(this.curDay)] != undefined){
      return this.scheduledEvents.CP[this.dfp.dateToDayString(this.curDay)];
    }
    return "CP";
  }
  getForDay(d){
    let oldDay = new Date(this.curDay);
    this.curDay = d;
    this.updateCurrentSchedule();
    const temp = this.curSchedule;
    this.curDay = oldDay;
    this.updateCurrentSchedule();
    return temp;
  }

  getTypes(){
    return this.typeList; //Returns the schedule type list
  }

  getToday(){
    return this.curSchedule; //Returns the current full Schedule for today
  }

  getCurrentScheduleName(){ //returns the current schedule type index
    return this.curScheduleName;
  }

  setCurrentType(newSchedIndex:number){ //sets the current schedule type to the given type
    this.curSchedule = this.typeList[newSchedIndex].schedule;
    this.curScheduleName = this.typeList[newSchedIndex].name;
  }

  changeDay(day){ //updates the current date
    this.curDay = day;
    this.updateCurrentSchedule();
  }

  getCurrentDay(){
    return this.curDay;
  }
}
