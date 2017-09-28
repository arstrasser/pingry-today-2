import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Rx';

import { Events } from 'ionic-angular';

import { SettingsProvider } from '../settings/settings';
import { FeedParseProvider } from '../feed-parse/feed-parse';
import { DateFunctionsProvider } from '../date-functions/date-functions';

@Injectable()
export class ScheduleProvider {
  typeList:Array<{name:string, schedule:any}> = [];
  scheduledDays: any = {};
  scheduledEvents:{CP:any, CT:any} = {CP: {}, CT:{}};
  curSchedule:Array<any>;
  curScheduleName:string;
  curDay:Date;
  refreshing:boolean = false;
  constructor(public http: Http, public feedParse:FeedParseProvider, public dfp:DateFunctionsProvider, public events:Events, public settings:SettingsProvider) {
    const normalSchedule = [
      {"name":"Attendance", "type":"Other", "startTime":"08:05", "endTime":"08:10"},
      {"name":"Period 1", "type":"block", "id":"1", "startTime":"08:10", "endTime":"09:15"},
      {"name":"Flex 1", "type":"flex", "id":"1", "startTime":"09:20", "endTime":"09:40"},
      {"name":"Community Time", "type":"CT", "startTime":"09:45", "endTime":"10:10"},
      {"name":"Period 2", "type":"block", "id":"2", "startTime":"10:15", "endTime":"11:20"},
      {"name":"Swappable 1", "type":"swap", "options":[
        {"name":"First Lunch", "type":"Lunch", "startTime":"11:25", "endTime":"11:55"},
        {"name":"Period 3", "type":"block", "id":"3", "startTime":"11:25", "endTime":"12:30"}]},
      {"name":"Swappable 2", "type":"swap", "options":[
        {"name":"Period 3", "type":"block", "id":"3", "startTime":"11:55", "endTime":"13:00"},
        {"name":"Second Lunch", "type":"Lunch", "startTime":"12:30", "endTime":"13:00"}]},
      {"name":"Flex 2", "type":"flex", "id":"0", "startTime":"13:05", "endTime":"13:25"},
      {"name":"Period 4", "type":"block", "id":"4", "startTime":"13:30", "endTime":"14:35"},
      {"name":"CP", "type":"CP", "startTime":"14:40", "endTime":"15:25"}
    ];

    const facultyCollabSchedule = [
      {"name":"Faculty Meetings", "type":"Other", "startTime":"08:05", "endTime":"09:30"},
      {"name":"Attendance", "type":"Other", "startTime":"09:35", "endTime":"09:40"},
      {"name":"Period 1", "type":"block", "id":"1", "startTime":"09:40", "endTime":"10:40"},
      {"name":"Flex 1", "type":"flex", "id":"1", "startTime":"10:40", "endTime":"11:00"},
      {"name":"Period 2", "type":"block", "id":"2", "startTime":"11:05", "endTime":"12:10"},
      {"name":"Swappable 1", "type":"swap", "options":[
        {"name":"First Lunch", "type":"Lunch", "startTime":"12:15", "endTime":"12:45"},
        {"name":"Period 3", "type":"block", "id":"3", "startTime":"12:15", "endTime":"13:00"}]},
      {"name":"Swappable 2", "type":"swap", "options":[
        {"name":"Period 3", "type":"block", "id":"3", "startTime":"12:45", "endTime":"13:30"},
        {"name":"Second Lunch", "type":"Lunch", "startTime":"13:00", "endTime":"13:30"}]},
      {"name":"Flex 2", "type":"flex", "id":"0", "startTime":"13:35", "endTime":"13:55"},
      {"name":"Period 4", "type":"block", "id":"4", "startTime":"14:00", "endTime":"14:45"},
      {"name":"CP", "type":"CP", "startTime":"14:50", "endTime":"15:25"}
    ];

    const assembly30Schedule = [
      {"name":"Attendance", "type":"Other", "startTime":"08:05", "endTime":"08:10"},
      {"name":"Period 1", "type":"block", "id":"1", "startTime":"08:10", "endTime":"09:15"},
      {"name":"Flex 1", "type":"flex", "id":"1", "startTime":"09:20", "endTime":"09:40"},
      {"name":"Community Time", "type":"CT", "startTime":"09:45", "endTime":"10:15"},
      {"name":"Period 2", "type":"block", "id":"2", "startTime":"10:20", "endTime":"11:20"},
      {"name":"Swappable 1", "type":"swap", "options":[
        {"name":"First Lunch", "type":"Lunch", "startTime":"11:25", "endTime":"11:55"},
        {"name":"Period 3", "type":"block", "id":"3", "startTime":"11:25", "endTime":"12:30"}]},
      {"name":"Swappable 2", "type":"swap", "options":[
        {"name":"Period 3", "type":"block", "id":"3", "startTime":"11:55", "endTime":"13:00"},
        {"name":"Second Lunch", "type":"Lunch", "startTime":"12:30", "endTime":"13:00"}]},
      {"name":"Flex 2", "type":"flex", "id":"0", "startTime":"13:05", "endTime":"13:25"},
      {"name":"Period 4", "type":"block", "id":"4", "startTime":"13:3", "endTime":"14:35"},
      {"name":"CP", "type":"CP", "startTime":"14:40", "endTime":"15:25"}
    ];

    const assembly35Schedule = [
      {"name":"Attendance", "type":"Other", "startTime":"08:05", "endTime":"08:10"},
      {"name":"Period 1", "type":"block", "id":"1", "startTime":"08:10", "endTime":"09:15"},
      {"name":"Flex 1", "type":"flex", "id":"1", "startTime":"09:15", "endTime":"09:35"},
      {"name":"Community Time", "type":"CT", "startTime":"09:40", "endTime":"10:15"},
      {"name":"Period 2", "type":"block", "id":"2", "startTime":"10:20", "endTime":"11:20"},
      {"name":"Swappable 1", "type":"swap", "options":[
        {"name":"First Lunch", "type":"Lunch", "startTime":"11:25", "endTime":"11:55"},
        {"name":"Period 3", "type":"block", "id":"3", "startTime":"11:25", "endTime":"12:25"}]},
      {"name":"Swappable 2", "type":"swap", "options":[
        {"name":"Period 3", "type":"block", "id":"3", "startTime":"12:00", "endTime":"13:00"},
        {"name":"Second Lunch", "type":"Lunch", "startTime":"12:30", "endTime":"13:00"}]},
      {"name":"Flex 2", "type":"flex", "id":"0", "startTime":"13:05", "endTime":"13:30"},
      {"name":"Period 4", "type":"block", "id":"4", "startTime":"13:35", "endTime":"14:35"},
      {"name":"CP", "type":"CP", "startTime":"14:40", "endTime":"15:25"}
    ];

    const assembly60Schedule = [
      {"name":"Attendance", "type":"Other", "startTime":"08:05", "endTime":"08:10"},
      {"name":"Period 1", "type":"block", "id":"1", "startTime":"08:10", "endTime":"09:10"},
      {"name":"Flex 1", "type":"flex", "id":"1", "startTime":"09:10", "endTime":"09:30"},
      {"name":"Assembly", "type":"CT", "startTime":"09:35", "endTime":"10:35"},
      {"name":"Period 2", "type":"block", "id":"2", "startTime":"10:40", "endTime":"11:45"},
      {"name":"Swappable 1", "type":"swap", "options":[
        {"name":"First Lunch", "type":"Lunch", "startTime":"11:50", "endTime":"12:20"},
        {"name":"Period 3", "type":"block", "id":"3", "startTime":"11:50", "endTime":"12:45"}]},
      {"name":"Swappable 2", "type":"swap", "options":[
        {"name":"Period 3", "type":"block", "id":"3", "startTime":"12:20", "endTime":"13:15"},
        {"name":"Second Lunch", "type":"Lunch", "startTime":"12:45", "endTime":"13:15"}]},
      {"name":"Flex 2", "type":"flex", "id":"0", "startTime":"13:20", "endTime":"13:35"},
      {"name":"Period 4", "type":"block", "id":"4", "startTime":"13:40", "endTime":"14:40"},
      {"name":"CP", "type":"CP", "startTime":"14:45", "endTime":"15:25"}
    ];

    const assembly40Schedule = [
      {"name":"Attendance", "type":"Other", "startTime":"08:05", "endTime":"08:10"},
      {"name":"Period 1", "type":"block", "id":"1", "startTime":"08:10", "endTime":"09:15"},
      {"name":"Flex 1", "type":"flex", "id":"1", "startTime":"09:15", "endTime":"09:30"},
      {"name":"Assembly", "type":"CT", "startTime":"09:35", "endTime":"10:15"},
      {"name":"Period 2", "type":"block", "id":"2", "startTime":"10:20", "endTime":"11:25"},
      {"name":"Swappable 1", "type":"swap", "options":[
        {"name":"First Lunch", "type":"Lunch", "startTime":"11:30", "endTime":"12:00"},
        {"name":"Period 3", "type":"block", "id":"3", "startTime":"11:30", "endTime":"12:35"}]},
      {"name":"Swappable 2", "type":"swap", "options":[
        {"name":"Period 3", "type":"block", "id":"3", "startTime":"12:00", "endTime":"13:05"},
        {"name":"Second Lunch", "type":"Lunch", "startTime":"12:35", "endTime":"13:05"}]},
      {"name":"Flex 2", "type":"flex", "id":"0", "startTime":"13:10", "endTime":"13:25"},
      {"name":"Period 4", "type":"block", "id":"4", "startTime":"13:30", "endTime":"14:35"},
      {"name":"CP", "type":"CP", "startTime":"14:40", "endTime":"15:25"}
    ];

    const reviewSchedule = [
      {"name":"Attendance", "type":"Other", "startTime":"08:00", "endTime":"08:05"},
      {"name":"Block 1", "type":"staticblock", "id":"1", "startTime":"08:10", "endTime":"08:55"},
      {"name":"Block 2", "type":"staticblock", "id":"2", "startTime":"09:00", "endTime":"09:45"},
      {"name":"US Meeting", "type":"CT", "startTime":"09:50", "endTime":"10:10"},
      {"name":"Block 3", "type":"staticblock", "id":"3", "startTime":"10:15", "endTime":"11:00"},
      {"name":"Block 4", "type":"staticblock", "id":"4", "startTime":"11:05", "endTime":"11:50"},
      {"name":"Swappable 1", "type":"swap", "determinant":"5", "options":[
        {"name":"First Lunch", "type":"Lunch", "startTime":"11:55", "endTime":"12:25"},
        {"name":"Block 5", "type":"staticblock", "id":"5", "startTime":"11:55", "endTime":"12:40"}]},
      {"name":"Swappable 2", "type":"swap", "determinant":"5", "options":[
        {"name":"Period 5", "type":"staticblock", "id":"5", "startTime":"12:30", "endTime":"13:15"},
        {"name":"Second Lunch", "type":"Lunch", "startTime":"12:45", "endTime":"13:15"}]},
      {"name":"Flex 2", "type":"specialflex", "id":"0", "startTime":"13:15", "endTime":"13:35"},
      {"name":"Block 6", "type":"staticblock", "id":"6", "startTime":"13:40", "endTime":"14:25"},
      {"name":"Block 7", "type":"staticblock", "id":"7", "startTime":"14:30", "endTime":"15:15"},
    ]

    const winterFestivalSchedule = [
      {"name":"Attendance", "type":"Other", "startTime":"08:05", "endTime":"08:10"},
      {"name":"Period 1", "type":"block", "id":"1", "startTime":"08:10", "endTime":"09:10"},
      {"name":"Flex 1", "type":"flex", "id":"1", "startTime":"09:10", "endTime":"09:30"},
      {"name":"Winter Festival", "type":"Other", "startTime":"09:35", "endTime":"11:00"},
      {"name":"Period 2", "type":"block", "id":"2", "startTime":"11:05", "endTime":"12:10"},
      {"name":"Swappable 1", "type":"swap", "options":[
        {"name":"First Lunch", "type":"Lunch", "startTime":"12:15", "endTime":"12:45"},
        {"name":"Period 3", "type":"block", "id":"3", "startTime":"12:15", "endTime":"13:10"}]},
      {"name":"Swappable 2", "type":"swap", "options":[
        {"name":"Period 3", "type":"block", "id":"3", "startTime":"12:45", "endTime":"13:40"},
        {"name":"Second Lunch", "type":"Lunch", "startTime":"13:10", "endTime":"13:40"}]},
      {"name":"Flex 2", "type":"flex", "id":"0", "startTime":"13:45", "endTime":"13:55"},
      {"name":"Period 4", "type":"block", "id":"4", "startTime":"14:00", "endTime":"14:50"},
      {"name":"CP", "type":"CP", "startTime":"14:55", "endTime":"15:30"}
    ];

    const unknownSchedule = [
      {"name":"Unknown Assembly Today", "type":"Other", "startTime":"", "endTime":""},
      {"name":"Attendance", "type":"Other", "startTime":"08:05", "endTime":"08:10"},
      {"name":"Period 1", "type":"block", "id":"1", "startTime":"08:10", "endTime":"09:15"},
      {"name":"Flex 1", "type":"flex", "id":"1", "startTime":"09:20", "endTime":"09:40"},
      {"name":"Community Time", "type":"CT", "startTime":"09:45", "endTime":"10:10"},
      {"name":"Period 2", "type":"block", "id":"2", "startTime":"10:15", "endTime":"11:20"},
      {"name":"Swappable 1", "type":"swap", "options":[
        {"name":"First Lunch", "type":"Lunch", "startTime":"11:25", "endTime":"11:55"},
        {"name":"Period 3", "type":"block", "id":"3", "startTime":"11:25", "endTime":"12:30"}]},
      {"name":"Swappable 2", "type":"swap", "options":[
        {"name":"Period 3", "type":"block", "id":"3", "startTime":"11:55", "endTime":"13:00"},
        {"name":"Second Lunch", "type":"Lunch", "startTime":"12:30", "endTime":"13:00"}]},
      {"name":"Flex 2", "type":"flex", "id":"0", "startTime":"13:05", "endTime":"13:25"},
      {"name":"Period 4", "type":"block", "id":"4", "startTime":"13:30", "endTime":"14:35"},
      {"name":"CP", "type":"CP", "startTime":"14:40", "endTime":"15:25"}
    ];
    //Variable to store all the schedule types
    this.typeList = [
      {name:"Normal", schedule:normalSchedule},
      {name:"Faculty Collaboration", schedule:facultyCollabSchedule},
      {name:"Assembly 30 Minutes", schedule:assembly30Schedule},
      {name:"Assembly 35 Minutes", schedule:assembly35Schedule},
      {name:"Assembly 40 Minutes", schedule:assembly40Schedule},
      {name:"Assembly 60 Minutes", schedule:assembly60Schedule},
      {name:"Review Day", schedule:reviewSchedule},
      {name:"Winter Festival", schedule:winterFestivalSchedule},
      {name:"Unknown Assembly", schedule:unknownSchedule}
    ];


    //Initializes the current day to be the system current day
    this.curDay = new Date();

    let temp = localStorage.getItem("lastScheduleRefresh");
    if(temp == null || temp == undefined || parseInt(temp) + 604800000 < Date.now()){ //Refresh if not ever loaded or if it's been a week
      this.refresh();
    }

    //Community Time event schedule
    temp = localStorage.getItem("scheduledEvents");
    if(temp != null){this.scheduledEvents = JSON.parse(temp);}

    //Special Schedule day schedule
    temp = localStorage.getItem("scheduledDays");
    if(temp != null){this.scheduledDays = JSON.parse(temp);}

    //Initialize current schedule to be the normal schedule
    this.curSchedule = this.typeList[0].schedule;

    this.curScheduleName = this.typeList[0].name;
  }

  refresh(callback?){
    const specialScheduleURL = "https://calendar.google.com/calendar/ical/pingry.org_kg3ab8ps5pa70oj41igegj9kjo%40group.calendar.google.com/public/basic.ics";
    const collabDatesURL = "http://www.pingry.org/calendar/calendar_388.ics";

    this.refreshing = true;
    return Observable.forkJoin([
      //Faculty collaboration day schedule refresh
      this.http.get(collabDatesURL).map(data => data.text()),
      this.http.get(specialScheduleURL).map(data => data.text())
    ]).subscribe((values) =>{
      let data = values[0];
      this.scheduledDays = {};

      //Deal with the faculty collaboration day schedule
      {
        //Parses the calendar
        let calEvents = this.feedParse.parseCalendar(data);
        //Iterate over the events
        for(let i=0; i<calEvents.length; i++){
          //If the event title contains the text Faculty Collaboration Day
          if(calEvents[i].title.indexOf("Faculty Collaboration Day") != -1){
            //Add the date string to a temporary array
            this.scheduledDays[this.dfp.dateToDayString(calEvents[i].time)] = "Faculty Collaboration";
          }
        }
        //Update the local storage
        localStorage.setItem("scheduledDays", JSON.stringify(this.scheduledDays));
      }


      {
        data = values[1];
        //Initialize variables:
        let calEvents = this.feedParse.parseCalendar(data);
        let CT = {};
        let CP = {};
        let specialSchedule = {};

        //Iterate over the calendar events
        for(let i=0; i < calEvents.length; i++){
          //If it's a timed event (not a day-long event)
          if(calEvents[i].type == "time" && !!calEvents[i].endTime){
            //Community Time
            if(
              ((calEvents[i].startTime.getHours() == 9 && calEvents[i].startTime.getMinutes() == 45) ||   //Starts at 9:45
                (calEvents[i].startTime.getHours() == 9 && calEvents[i].startTime.getMinutes() == 50)) && //  or      9:50
              ((calEvents[i].endTime.getHours() == 10 && calEvents[i].endTime.getMinutes() == 10) ||      //Ends   at 10:10
                (calEvents[i].endTime.getHours() == 10 && calEvents[i].endTime.getMinutes() == 15))) {    //  or      10:15

              //If community time already has an event scheduled, appends event name
              if(CT[this.dfp.dateToDayString(calEvents[i].startTime)]){
                //Fixes Duplicate events - TODO: Figure out why this bug occurs
                if(CT[this.dfp.dateToDayString(calEvents[i].startTime)].indexOf(calEvents[i].title) == -1){
                  CT[this.dfp.dateToDayString(calEvents[i].startTime)] += " & "+calEvents[i].title;
                }
              }
              //Otherwise, just set the variable to the event title
              else {
                CT[this.dfp.dateToDayString(calEvents[i].startTime)] = calEvents[i].title;
              }
            }
            //CP
            else if(
                ((calEvents[i].startTime.getHours() == 14 && calEvents[i].startTime.getMinutes() == 45) || //Starts at 2:45
                (calEvents[i].startTime.getHours() == 14 && calEvents[i].startTime.getMinutes() == 40) ||  //  or      2:40
                (calEvents[i].startTime.getHours() == 14 && calEvents[i].startTime.getMinutes() == 35))    //  or      2:35

              && ((calEvents[i].endTime.getHours() == 15 && calEvents[i].endTime.getMinutes() == 25) ||    //Ends at   3:25
                (calEvents[i].endTime.getHours() == 15 && calEvents[i].endTime.getMinutes() == 30) ||      //  or      3:30
                (calEvents[i].endTime.getHours() == 15 && calEvents[i].endTime.getMinutes() == 15))){      //  or      3:15

              //If CP already has an event scheduled, append current event name
              if(CP[this.dfp.dateToDayString(calEvents[i].startTime)]){
                if(CP[this.dfp.dateToDayString(calEvents[i].startTime)].indexOf(calEvents[i].title) == -1){
                  CP[this.dfp.dateToDayString(calEvents[i].startTime)] += " & "+calEvents[i].title;
                }
              }
              //Otherwise, just set the variable to the event title
              else{
                CP[this.dfp.dateToDayString(calEvents[i].startTime)] = calEvents[i].title;
              }
            }

            //Assembly
            else if(calEvents[i].title.indexOf("Assembly") != -1){
              if(calEvents[i].startTime.getHours() == 9 && calEvents[i].startTime.getMinutes() == 35 && calEvents[i].endTime.getHours() == 10 && calEvents[i].endTime.getMinutes() == 35)
                specialSchedule[this.dfp.dateToDayString(calEvents[i].endTime)] = "Assembly 60 Minutes";
              else if(calEvents[i].startTime.getHours() == 9 && calEvents[i].startTime.getMinutes() == 35 && calEvents[i].endTime.getHours() == 10 && calEvents[i].endTime.getMinutes() == 15)
                specialSchedule[this.dfp.dateToDayString(calEvents[i].endTime)] = "Assembly 40 Minutes";
              else if(calEvents[i].startTime.getHours() == 9 && calEvents[i].startTime.getMinutes() == 40 && calEvents[i].endTime.getHours() == 10 && calEvents[i].endTime.getMinutes() == 15)
                specialSchedule[this.dfp.dateToDayString(calEvents[i].endTime)] = "Assembly 35 Minutes";
              else if(calEvents[i].startTime.getHours() == 9 && calEvents[i].startTime.getMinutes() == 45 && calEvents[i].endTime.getHours() == 10 && calEvents[i].endTime.getMinutes() == 15)
                specialSchedule[this.dfp.dateToDayString(calEvents[i].endTime)] = "Assembly 30 Minutes";
              else {
                //Check for Winter Festival Schedule
                if(calEvents[i].title.indexOf("Winter Festival") != -1){
                  specialSchedule[this.dfp.dateToDayString(calEvents[i].endTime)] = "Winter Festival";
                }
                //Unknown assembly
                else{
                  console.warn("Unknown Assembly:");
                  console.log(calEvents[i]);
                  specialSchedule[this.dfp.dateToDayString(calEvents[i].endTime)] = "Unknown Assembly";
                }
              }
            }else{
              console.log("Unknown: "+calEvents[i].startTime.getHours() +":"+calEvents[i].startTime.getMinutes()+" - "+calEvents[i].endTime.getHours() +":"+calEvents[i].endTime.getMinutes());
            }
          }
          //If it's a day type event (occurs for the whole day)
          else if(calEvents[i].type == "day"){
            if(calEvents[i].title.toLowerCase().indexOf("review day") != -1){
              specialSchedule[this.dfp.dateToDayString(calEvents[i].time)] = "Review Day";

              //Publish an event so that the letter day provider can update as well
              this.events.publish("newReviewDay", {date:this.dfp.dateToDayString(calEvents[i].time)});
            }
            /*
            // Faculty Collaboration day implementation commented out since using alternate calendar.
            // For faster performance but lower accuracy, uncomment this and remove the first calendar parse.
            if(calEvents[i].title.indexOf("Collab") != -1 && calEvents[i].title.indexOf("Fac") != -1){
              facultyCollabDays.push(dateToDayString(calEvents[i].time));
            }*/
          }
          else{
            //Unknown event type
            console.log("Unknown type: ");
            console.log(calEvents[i]);
          }
        }

        this.scheduledEvents = {CT, CP};
        localStorage.setItem("scheduledEvents", JSON.stringify(this.scheduledEvents));

        //Special Schedule update in storage and in runtime
        localStorage.setItem("scheduledDays", JSON.stringify(specialSchedule));
        this.scheduledDays = specialSchedule;

        //Update the last refresh time
        localStorage.setItem("lastScheduleRefresh", Date.now().toString());

        //Updates the current schedule type to reflect new information
        this.updateCurrentSchedule();
      }
      this.refreshing = false;
      this.events.publish("scheduleRefreshComplete", {success:true});
      if(callback){callback(true)}
      return true;
    }, () => {
      this.refreshing = false;
      this.events.publish("scheduleRefreshComplete", {success:false});
      if(callback){callback(false)}
      return false;
    });
  }

  updateCurrentSchedule() {
    //If today has a special schedule
    const override = this.settings.remoteOverride.scheduleOverride[this.dfp.dateToDayString(this.curDay)]
    if(override != undefined){
      if(override.type == "manual"){
        this.curSchedule = override.classes;
        this.curScheduleName = "manual";
        return;
      }else{
        for(let i = 0; i < this.typeList.length; i++){
          //if found the respective schedule for the day
          if(this.typeList[i].name == override.name){
            this.curSchedule = this.typeList[i].schedule;
            this.curScheduleName = this.typeList[i].name;
            return;
          }
        }
        console.error("OVERRIDE NOT FOUND: "+override.name);
      }
    }
    else if(this.scheduledDays != null && this.scheduledDays[this.dfp.dateToDayString(this.curDay)] != undefined){
      //Iterate over the schedule types
      for(let i = 0; i < this.typeList.length; i++){
        //if found the respective schedule for the day
        if(this.typeList[i].name == this.scheduledDays[this.dfp.dateToDayString(this.curDay)]){
          this.curSchedule = this.typeList[i].schedule;
          this.curScheduleName = this.typeList[i].name;
          return;
        }
      }
      console.error("Couldn't find schedule: "+this.scheduledDays[this.dfp.dateToDayString(this.curDay)]);
    }
    //Fallback
    this.curSchedule = this.typeList[0].schedule;
    this.curScheduleName = this.typeList[0].name;
  }

  get(id){
    return this.curSchedule[id];  //returns the current schedule list element of index id
  }

  getCTSchedule(){ //Returns the scheduled activity for community time for the current day
    if(this.settings.remoteOverride.eventsOverride.CT[this.dfp.dateToDayString(this.curDay)] != undefined){
      return this.settings.remoteOverride.eventsOverride.CT[this.dfp.dateToDayString(this.curDay)];
    }
    if(this.scheduledEvents.CT[this.dfp.dateToDayString(this.curDay)] != undefined){
      return this.scheduledEvents.CT[this.dfp.dateToDayString(this.curDay)];
    }
    return "Community Time";
  }

  getCPSchedule(){ //Returns the scheduled activity for conference for the current day
    if(this.settings.remoteOverride.eventsOverride.CP[this.dfp.dateToDayString(this.curDay)] != undefined){
      return this.settings.remoteOverride.eventsOverride.CP[this.dfp.dateToDayString(this.curDay)];
    }
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
