import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Events } from 'ionic-angular';
import 'rxjs/add/operator/map';

import { FeedParseProvider } from "../feed-parse/feed-parse";
import { DateFunctionsProvider } from "../date-functions/date-functions";
import { ScheduleProvider } from "../schedule/schedule";
import { SettingsProvider } from "../settings/settings";

class Dates{
  A:Array<number>;
  B:Array<number>;
  C:Array<number>;
  D:Array<number>;
  E:Array<number>;
  F:Array<number>;
  G:Array<number>;
  R:Array<number>; //Review Days
}
/*
  Generated class for the LetterDayProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class LetterDayProvider {
  time:number;
  dates:Dates;
  times:Array<{letter:string, schedule:Array<number>, dates:Array<number>}>;
  refreshing:boolean;
  curDay:number;
  d:any;

  constructor(public http:Http, public feedParse:FeedParseProvider, public dfp:DateFunctionsProvider, public events:Events,
      public schedule:ScheduleProvider, public settings:SettingsProvider){
    let temp:string = localStorage.getItem("lastLetterRefresh");

    if(temp == null || temp == undefined || parseInt(temp) + 604800000 < Date.now() ){ //Refresh if not refreshed or if it's been a week
      this.refresh();
    }else{
      this.time = parseInt(temp);
    }

    temp = localStorage.getItem("letterDayDates");
    if(temp == undefined || temp == null || temp == ""){
      this.dates = {"A":[], "B":[], "C":[], "D":[], "E":[], "F":[], "G":[], "R":[]};
    }else{
      this.dates = JSON.parse(temp);
    }

    this.times = [
      {"letter":"A", "schedule":[1,2,3,4], "dates":this.dates.A},
      {"letter":"B", "schedule":[5,6,7,1], "dates":this.dates.B},
      {"letter":"C", "schedule":[2,3,4,5], "dates":this.dates.C},
      {"letter":"D", "schedule":[6,7,1,2], "dates":this.dates.D},
      {"letter":"E", "schedule":[3,4,5,6], "dates":this.dates.E},
      {"letter":"F", "schedule":[7,1,2,3], "dates":this.dates.F},
      {"letter":"G", "schedule":[4,5,6,7], "dates":this.dates.G},
      {"letter":"R", "schedule":[], "dates":(this.dates.R || [])}
    ];

    this.events.subscribe("newReviewDay", obj => {
      if(this.times[7].dates.indexOf(obj.date) == -1){
        this.times[7].dates.push(obj.date);
        this.dates.R.push(obj.date);
      }
      localStorage.setItem("letterDayDates", JSON.stringify(this.dates));
    })

    this.updateDay(new Date());
  }

  //Function to refresh all data from the letter day ical
  refresh(){
    this.refreshing = true;
    const letterDayURL = "http://www.pingry.org/calendar/calendar_384.ics"; //URL of the LetterDay calendar for the Upper School
    //Returns a promise so that you can run async functions after this function completes
    //(e.g.Calling LetterDay.refresh.then(function(){code here}))
    return this.http.get(letterDayURL).map((data)=>data.text()).subscribe((data) => {
      const calEvents = this.feedParse.parseCalendar(data);
      this.dates = {"A":[], "B":[], "C":[], "D":[], "E":[], "F":[], "G":[], "R":[]};
      //Iterate through calendar events
      for(let i = 0; i < calEvents.length; i++){
        //Ensures that it is a day long event
        if(calEvents[i].type == "day"){
          //Adds the first letter of that event to the calendar
          if(calEvents[i].title.length == 1 && this.dates.hasOwnProperty(calEvents[i].title.substring(0,1))){
            this.dates[calEvents[i].title.substring(0,1)].push(this.dfp.dateToDayString(calEvents[i].time));
          }
        }
      }

      //Update localStorage items
      localStorage.setItem("letterDayDates", JSON.stringify(this.dates));
      localStorage.setItem("lastLetterRefresh", JSON.stringify(Date.now()));

      //Updates the arrays in current memory
      this.times[0].dates = this.dates.A;
      this.times[1].dates = this.dates.B;
      this.times[2].dates = this.dates.C;
      this.times[3].dates = this.dates.D;
      this.times[4].dates = this.dates.E;
      this.times[5].dates = this.dates.F;
      this.times[6].dates = this.dates.G;
      this.times[7].dates = this.dates.R;

      //Updates the letter day if there are different letter days for the current date
      this.updateDay(this.d);
      return true;
    }, () => false).add(val => {
      this.refreshing = false;
      this.events.publish("letterRefreshComplete", {success:val});
      return val;
    });
  }

  //Function to get the index of the current date in one of the date arrays
  getIndexOf(date:string):number{
    //Check override first
    if(this.settings.remoteOverride.letterOverride[date] != undefined){
      return this.letterToNumber(this.settings.remoteOverride.letterOverride[date]);
    }

    //Iterate through each letter
    for(let i = 0; i < this.times.length; i+=1){
      //Iterate through each date
      for(let j = 0; j < this.times[i].dates.length; j++){
        //If the date equals the date we're looking for
        if(this.times[i].dates[j] == parseInt(date)){
          //Return the index
          return i;
        }
      }
    }
    //Returns -1 if it can't find it
    return -1;
  };

  //Function to convert a letter day letter into a numerical index of the times object
  letterToNumber(letter:string):number{
    switch(letter){
      case "A":
        return 0;
      case "B":
        return 1;
      case "C":
        return 2;
      case "D":
        return 3;
      case "E":
        return 4;
      case "F":
        return 5;
      case "G":
        return 6;
      case "R":
        return 7;
      default:
        return -1;
    }
  }

  //Updates the current letter day and the current date
  updateDay(day:any){
    this.d = day;
    this.curDay = this.getIndexOf(this.dfp.dateToDayString(day));
  }

  //Initialize the date to be the current date


  letter() {
    if(this.curDay != -1){
      return this.times[this.curDay].letter;
    }
    else if(this.times[0].dates.length== 0 && (this.refreshing || this.schedule.refreshing)){
      return "refreshing";
    }
    //If the schedule isn't updated, return an empty string
    else if(this.times[0].dates.length == 0){
      return "empty";
    }
    return "";
  }

  letterOf(day){ //Returns what letter a given date would be
    var dayString = this.dfp.dateToDayString(day);
    var index = this.getIndexOf(dayString);
    if(index == -1){
      return "";
    }
    return this.times[index].letter;
  }

  classes() { //Returns an array of class numbers for the current day
    if(this.curDay != -1){
      return this.times[this.curDay].schedule;
    }
    return [];
  }

  getDatesOf(letter){ //Gets all the dates for a given letter day
    return this.times[this.letterToNumber(letter)].dates;
  }

  classesOf(day){ //Returns the classes of the given date
    var ind = this.getIndexOf(this.dfp.dateToDayString(day));
    if(ind != -1)
      return this.times[ind].schedule;
    return [];
  }

  dayOfWeek(){ //Returns the current date's day of the week
    return this.d.getDay();
  }

  nextLetterDayDate(d:Date):Date{
    let i = 0;
    while(this.getIndexOf(this.dfp.dateToDayString(d)) == -1){
      d.setDate(d.getDate()+1);
      if(++i > 200){
        return undefined;
      }
    }
    return d;
  }

}
