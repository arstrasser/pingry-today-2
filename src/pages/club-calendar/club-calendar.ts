import { Component } from '@angular/core';
import { IonicPage, LoadingController } from 'ionic-angular';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import { FeedParseProvider } from '../../providers/feed-parse/feed-parse';
import { MessagesProvider } from '../../providers/messages/messages';
import { DateFunctionsProvider } from '../../providers/date-functions/date-functions';



@IonicPage()
@Component({
  selector: 'page-club-calendar',
  templateUrl: 'club-calendar.html',
})
export class ClubCalendarPage {
  events:Array<any> = [];
  l:any;
  constructor(public http:Http, public loadingCtrl:LoadingController,
     public feedParse:FeedParseProvider, public messages: MessagesProvider, public dfp:DateFunctionsProvider) {

    this.localRefresh();
    const lastRefresh = localStorage.getItem("clubEventsRefreshTime");
    //If it's been over an hour, run a full refresh
    if(lastRefresh == null || lastRefresh =="" || (lastRefresh != null && lastRefresh != "" && parseInt(lastRefresh) + 360000 < Date.now())){
      this.l = this.loadingCtrl.create();
      this.l.present();
      this.refresh();
    }
  }

  fixTime(hours, minutes){
    var AM = true;
    if(hours > 12){
      hours -= 12;
      AM = false;
    }else if(hours == 12){
      AM = false;
    }else if(hours == 0){
      hours = 12;
    }
    return (hours) + ":" + ((minutes<10)?"0":"")+minutes+" "+(AM?"AM":"PM");
  }

  formatTime(time){
    var jsTime = new Date(time);
    if(jsTime.getHours() == 0 && jsTime.getMinutes() == 0){
      return (jsTime.getMonth()+1)+"/"+jsTime.getDate()
    }
    return this.fixTime(jsTime.getHours(), jsTime.getMinutes())+" "+(jsTime.getMonth()+1)+"/"+jsTime.getDate();
  }

  //Refreshes the announcements
  refresh(refresher?){
    this.http.get("http://www.pingry.org/calendar/calendar_391.ics").map(data => this.feedParse.parseCalendar(data.text())).subscribe((value) => {
      let rawEvents:Array<any> = value;
      console.log(JSON.parse(JSON.stringify(rawEvents)));
      for(var i = 0; i < rawEvents.length; i++){

        //Convert from Javascript dates into numbers
        if(!!rawEvents[i].startTime){
          rawEvents[i].startTime = rawEvents[i].startTime.getTime();
        }
        if(!!rawEvents[i].endTime){
          rawEvents[i].endTime = rawEvents[i].endTime.getTime();
        }
      }

      //Iterate over the events to fix Javscript Time objecs and such (also removing past events)
      for(var i = 0; i < rawEvents.length; i++){
        //Time type event
        if(rawEvents[i].type == "time"){
          //If the event end time is less than the current time
          if(rawEvents[i].startTime < Date.now()){
            //Remove the event
            rawEvents.splice(i,1);
            i--;
          }
        }
        //Day type event
        else if(rawEvents[i].type == "day"){
          //If the event's time is less than the current time and the event isn't today
          if(rawEvents[i].time < Date.now() && this.dfp.dateToDayString(this.dfp.parseStringForDate(rawEvents[i].time)) != this.dfp.dateToDayString(new Date())){
            //Remove the event
            rawEvents.splice(i,1);
            i--;
          }
          else{
            //Set the start time to be the time (makes for easier sorting and display)
            rawEvents[i].startTime = rawEvents[i].time;
          }
        }
      }

      //Sorts the event by time, then by title, then by description
      rawEvents.sort(
        function(a,b){
          if(a.startTime==b.startTime){
            if(a.title == b.title){
              return a.location.localeCompare(b.location);
            }else{
              return a.title.localeCompare(b.title);
            }
          }
          else{
            return a.startTime>b.startTime?1:-1;
          }
        }
      );

      //Only take the first 15 events
      if(rawEvents.length > 25){
        rawEvents = rawEvents.slice(0,25);
      }
      //Update local storage
      localStorage.setItem("clubEvents", JSON.stringify(rawEvents));
      localStorage.setItem("clubEventsRefreshTime", ""+Date.now());
      this.events = rawEvents;
    }, ()=>this.messages.showError("Couldn't connect to the internet!")).add(() =>{
      if(refresher) refresher.complete();
      if(!!this.l){ this.l.dismissAll(); this.l = null; }
    });
  }



  //Locally refreshes from local storage
  localRefresh(){
    const obj = localStorage.getItem("clubEvents");
    if(obj != undefined){
      this.events = JSON.parse(obj);
    }
  }
}
