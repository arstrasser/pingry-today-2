import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Events } from '@ionic/angular';

import { DateFunctionsService } from "./date-functions.service";
import { ScheduleService } from "./schedule.service";
import { SettingsService } from "./settings.service";

@Injectable({
  providedIn: 'root'
})
export class LetterDayService {
  times:Array<{letter:string, schedule:Array<number>, dates:Array<string>}>;
  refreshing:boolean;
  curDay:number;
  d:any;

  constructor(public http:Http, public dfp:DateFunctionsService, public events:Events,
      public schedule:ScheduleService, public settings:SettingsService){
    let temp = localStorage.getItem("letterDays");
    if(temp){
      this.times = JSON.parse(temp);
    }else{
      this.times = [
        {"letter":"A", "schedule":[1,2,3,4], "dates":[]},
        {"letter":"B", "schedule":[5,6,7,1], "dates":[]},
        {"letter":"C", "schedule":[2,3,4,5], "dates":[]},
        {"letter":"D", "schedule":[6,7,1,2], "dates":[]},
        {"letter":"E", "schedule":[3,4,5,6], "dates":[]},
        {"letter":"F", "schedule":[7,1,2,3], "dates":[]},
        {"letter":"G", "schedule":[4,5,6,7], "dates":[]},
        {"letter":"R", "schedule":[1,2,3,4,5,6,7], "dates":[]}
      ];
    }

    this.updateDay(new Date());

    this.refresh();
  }

  //Function to refresh all data from the letter day ical
  refresh(callback?){
    this.refreshing = true;
    const letterDayURL = "https://pingrytoday.pingry.org:3001/v1/letter?api_key="+this.settings.apiKey; //URL of the LetterDay calendar for the Upper School
    //Returns a subscription so that you can run async functions after this function completes
    //(e.g.Calling LetterDay.refresh.then(function(){code here}))
    return this.http.get(letterDayURL).subscribe((data) => {
      this.times = data.json();

      //Update localStorage items
      localStorage.setItem("letterDays", JSON.stringify(this.times));

      //Updates the letter day if there are different letter days for the current date
      this.updateDay(this.d);
      this.refreshing = false;
      this.events.publish("letterRefreshComplete", {success:true});
      if(callback){callback(true)}
      return true;
    }, () => {
      this.refreshing = false;
      this.events.publish("letterRefreshComplete", {success:false});
      if(callback){callback(false)}
      return false;
    });
  }

  //Function to get the index of the current date in one of the date arrays
  getIndexOf(date:string):number{
    //Iterate through each letter
    for(let i = 0; i < this.times.length; i+=1){
      //Iterate through each date
      for(let j = 0; j < this.times[i].dates.length; j++){
        //If the date equals the date we're looking for
        if(this.times[i].dates[j] == date){
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

  getNextDatesOf(letter){ //Gets all the dates for a given letter day
    let dates = [];
    let original:any = this.times[this.letterToNumber(letter)].dates;
    for(let i = 0; i < original.length; i++){
      //Day after that date since minutes and seconds cause for round upwards
      if(new Date(original[i].substring(0,4), parseInt(original[i].substring(4,6))-1, parseInt(original[i].substring(6,8))+1).getTime() > Date.now()){
        dates.push(original[i]);
      }
    }
    return dates;
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
