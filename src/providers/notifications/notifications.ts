import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import { LocalNotifications } from '@ionic-native/local-notifications';

import { DateFunctionsProvider } from '../date-functions/date-functions';
import { LetterDayProvider } from '../letter-day/letter-day';

/*
  Generated class for the DateFunctionsProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class NotificationsProvider {
  reminders:Array<{name:string, description:string, time:{date:number, time:{hours:number, minutes:number}, day:any}, type:string}> = [];

  constructor(public http: Http, public dfp: DateFunctionsProvider, public letterDay:LetterDayProvider, public notifications: LocalNotifications) {
    this.refresh();
  }

  refresh(){
    //Load reminders from the local storage
    let temp = localStorage.getItem("reminders");
    //If there aren't any reminders stored
    if(!!temp && temp != "") {
      //JSON parse the string
      this.reminders = JSON.parse(temp);
    }
  }

  scheduleAll(){
    //Removes all prior scheduled notifications
    return this.notifications.cancelAll().then(() => {
      //For each reminder
      for(var i = 0; i < this.reminders.length; i++){

        //Weekday repeat type
        if(this.reminders[i].type == "weekday"){
          //Start with today
          let d = new Date();
          //Set the Hours and minutes the the proper time
          d.setHours(this.reminders[i].time.time.hours);
          d.setMinutes(this.reminders[i].time.time.minutes);

          this.dfp.setDay(d, this.reminders[i].time.day);

          //Only schedule the next 100 to minimize storage load (Should last ~2 years)
          for(var j = 0; j < 100; j++){
            this.scheduleNotification(i*1000+j, d, this.reminders[i].description)
            d.setDate(d.getDate()+7);
          }
        }

        //Letter Day repeat type
        else if(this.reminders[i].type == "letter"){
          //Gets all the future dates of
          let dates = this.letterDay.getDatesOf(this.reminders[i].time.day);
          //Schedules until runs out or just the next 100
          for(var j = 0; j < dates.length && j < 100; j++){
            //Sets the day to the given date
            var d = new Date(dates[j]);
            //Set the hours and minutes to the proper time
            d.setHours(this.reminders[i].time.time.hours);
            d.setMinutes(this.reminders[i].time.time.minutes);
            if(d.getTime() > Date.now()){
              //Schedule the notification
              //Ensures unique id by multiplying by 1000 and adding j
              this.scheduleNotification(i*1000+j, d, this.reminders[i].description);
            }
          }
        }

        //Single event
        else if(this.reminders[i].type == "single"){
          //Date of the event
          const date = new Date(this.reminders[i].time.date);
          //Time of the event
          const time = this.reminders[i].time.time;
          //Date + Time combined to schedule the event for the notification
          const schedDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), time.hours, time.minutes);
          this.scheduleNotification(i*1000, schedDate, this.reminders[i].description);
        }
      }
    });
  }

  scheduleNotification(id, date, desc){
    //Schedules a notification with the given parameters
    if(date.getTime() >= Date.now()){
      this.notifications.schedule({
        id: id,
        at: date,
        text: desc,
        title: "Pingry",
        led: 'FFFFFF'
      });
    }else{
      console.log("Cancelled scheduling "+desc+" at "+date+" because it was too early.");
    }
  }

  getAll(){
    //Returns all the reminders
    return this.reminders;
  }

  get(num){
    //Returns the reminder at index num
    return this.reminders[num];
  }

  save(){
    //Update the localstorage and reschedule all notifications
    localStorage.setItem("reminders", JSON.stringify(this.reminders));
    this.scheduleAll();
  }

  add(reminder){
    //Adds the reminder to the list of remidners
    this.reminders.push(reminder);
  }

  remove(ind){
    //removes the reminder at index ind
    this.reminders.splice(ind, 1);
  }
}
