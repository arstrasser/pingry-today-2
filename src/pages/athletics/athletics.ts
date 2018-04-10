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
  displayEvents:Array<any> = [];
  l:any;
  constructor(public iab: InAppBrowser, public http:Http, public feedParse:FeedParseProvider, public messages: MessagesProvider,
    public settings:SettingsProvider, public dfp:DateFunctionsProvider, public loadingCtrl:LoadingController) {
    this.l = this.loadingCtrl.create();
    this.l.present();
    this.refresh();
  }

  displayMore(infiniteScroll?){
    this.displayEvents = this.events.slice(0, Math.min(this.displayEvents.length+25, this.events.length));
    if(infiniteScroll){infiniteScroll.complete();}
  }

  ionViewBeforeEnter(){
    if(this.settings.getAthleticSubscriptionChanged()){
      this.events = [];
      this.displayEvents = [];
      localStorage.removeItem("athleticEvents");
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
    let url = "";
    if(this.settings.athleticSubscriptions.length > 0){
      url = "http://compsci.pingry.k12.nj.us:3000/athletics/sports?api_key"+this.settings.apiKey;
      for(let i = 0; i < this.settings.athleticSubscriptions.length; i++){
        url += "&sport="+this.settings.athleticSubscriptions[i];
      }
    }else{
      url = "http://compsci.pingry.k12.nj.us:3000/athletics/sports/all?api_key"+this.settings.apiKey;
    }

    this.http.get(url).map(data => data.json()).subscribe(data => {

      //Delete past events
      let i = 0;
      let now = Date.now()
      while(data[i].startTime < now) i++;
      data.splice(i);

      //Update local storage
      localStorage.setItem("athleticEvents", JSON.stringify(data));
      this.events = data;
      this.displayEvents = this.events.slice(0,25);
    }, ()=>{
      this.messages.showError("Couldn't connect to the internet!");
      this.localRefresh();
    }).add(() => {
      if(refresher) refresher.complete();
      if(!!this.l){ this.l.dismissAll(); this.l = null; }
    });
  }

  //Locally refreshes from local storage
  localRefresh(){
    const obj = localStorage.getItem("athleticEvents");
    if(obj != undefined){
      this.events = JSON.parse(obj);
      this.displayEvents = this.events.slice(0,25);
    }
  }
}
