import { Component } from '@angular/core';
import { IonicPage, LoadingController } from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { Http } from '@angular/http';
import { Observable }     from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { FeedParseProvider } from '../../providers/feed-parse/feed-parse';
import { MessagesProvider } from '../../providers/messages/messages';
import { SettingsProvider } from '../../providers/settings/settings';
import { DateFunctionsProvider } from '../../providers/date-functions/date-functions';



@IonicPage()
@Component({
  selector: 'page-athletics',
  templateUrl: 'athletics.html',
})
export class AthleticsPage {
  events:Array<any> = [];
  l:any;
  constructor(public iab: InAppBrowser, public http:Http, public feedParse:FeedParseProvider, public messages: MessagesProvider,
    public settings:SettingsProvider, public dfp:DateFunctionsProvider, public loadingCtrl:LoadingController) {
    console.log(this.events);
    const lastRefresh = localStorage.getItem("athleticEventsRefreshTime");
    //If it's been over an hour, run a full refresh
    if(lastRefresh != null && lastRefresh != ""){
      if(parseInt(lastRefresh) + 360000 < Date.now()){
        this.l = this.loadingCtrl.create();
        this.l.present();
        this.refresh();
      }else{
        this.localRefresh();
      }
    }
    else{
      this.l = this.loadingCtrl.create();
      this.l.present();
      this.refresh();
    }
    console.log(this.events);
  }

  ionViewBeforeEnter(){
    if(this.settings.getAthleticSubscriptionChanged()){
      this.events = [];
      //$ionicLoading.show({template: 'Loading...'});
      this.refresh();
      this.settings.setAthleticSubscriptionChanged(false);
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

  openMapsLocation(loc){
    if(this.settings.athleticMaps){
      this.iab.create("http://maps.google.com/?q="+loc, '_system');
    }
  }

  //Refreshes the announcements
  refresh(refresher?){
    let calendars = this.settings.getAthleticCalendars();
    var queuedEvents = [];
    for(var i = 0; i < calendars.length; i++){
      if(this.settings.athleticSubscription == "" || this.settings.athleticSubscription == calendars[i][1]){
        queuedEvents.push(
          this.http.get(calendars[i][1]).map(data => this.feedParse.parseCalendar(data.json().data))
        );
      }
    }

    Observable.forkJoin(queuedEvents).subscribe((values) => {
      let rawEvents = [];
      for(let i = 0; i < values.length; i++){
        rawEvents = rawEvents.concat(values[i]);
      }
      console.log(values);
      console.log(rawEvents);
      for(var i = 0; i < rawEvents.length; i++){
        //TODO: FIGURE OUT WHAT THE HECK THIS LINE DOES
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

      //Add descriptions for each event and fix titles
      for(var i = 0; i < rawEvents.length; i++){
        if(rawEvents[i].desc == undefined){
          var title = rawEvents[i].title;
          var desc = title.substring(title.indexOf(" - ")+3);
          title = title.substring(0, title.indexOf(" - "));
          rawEvents[i].title = title;
          rawEvents[i].desc = desc;
        }
      }

      //Sorts the event by time, then by title, then by description
      rawEvents.sort(
        function(a,b){
          if(a.startTime==b.startTime){
            if(a.title == b.title){
              return a.desc.localeCompare(b.desc);
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
      localStorage.setItem("athleticEvents", JSON.stringify(rawEvents));
      localStorage.setItem("athleticEventsRefreshTime", ""+Date.now());
      this.events = rawEvents;
      //$ionicLoading.hide();
    }, ()=>this.localRefresh()).add(() =>{
      if(refresher) refresher.complete();
      if(!!this.l){ this.l.dismissAll(); this.l = null; }
    });
  }



  //Locally refreshes from local storage
  localRefresh(){
    const obj = localStorage.getItem("athleticEvents");
    if(obj != undefined){
      this.events = JSON.parse(obj);
    }else{
      this.messages.showError("Couldn't connect to the internet!");
    }
  }


}
