import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { Http } from '@angular/http';

import { MessagesService } from '../messages.service';
import { SettingsService } from '../settings.service';
import { DateFunctionsService } from '../date-functions.service';


@Component({
  selector: 'app-athletics',
  templateUrl: './athletics.page.html',
  styleUrls: ['./athletics.page.scss'],
})
export class AthleticsPage implements OnInit {
  events:Array<{
    title: string,
    desc:string,
    startTime:number,
    event_status?:string,
    location:string,
    game_outcome?:string,
    game_placement?:string,
    google_map?:string,
    primary_group?:string
  }> = [];
  displayEvents:Array<any> = [];
  l:any;
  constructor(public iab: InAppBrowser, public http:Http, public messages: MessagesService,
    public settings:SettingsService, public dfp:DateFunctionsService, public loadingCtrl:LoadingController) { }

  ngOnInit() {
    this.loadingCtrl.create().then((l) => {
      l.present();
      this.l = l;
      this.refresh();
    })

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

  openMapsLocation(event){
    if(event.google_map){
      this.iab.create(event.google_map, '_system');
    }
    this.iab.create("http://maps.google.com/?q="+event.location, '_system');
  }

  eventCancelled(event){
    return event.event_status == "Cancelled";
  }

  //Refreshes athletic events
  refresh(refresher?){
    let url = "";
    this.settings.getAthleticSubscriptions().then((athleticSubscriptions) => {
      if(athleticSubscriptions.length > 0 && athleticSubscriptions[0] != '-1'){
        url = "https://pingrytoday.pingry.org:3001/v1/athletics/sports?api_key="+this.settings.apiKey;
        for(let i = 0; i < athleticSubscriptions.length; i++){
          url += "&sport="+athleticSubscriptions[i];
        }
      }else{
        url = "https://pingrytoday.pingry.org:3001/v1/athletics/sports/all?api_key="+this.settings.apiKey;
      }

      this.http.get(url).subscribe(data => {
        let temp = data.json()
        //Delete past events
        let i = 0;
        let now = Date.now()
        while(temp[i].startTime < now) i++;
        temp = temp.slice(i);

        //Update local storage
        localStorage.setItem("athleticEvents", JSON.stringify(temp));
        this.events = temp;
        this.displayEvents = this.events.slice(0,25);
      }, ()=>{
        this.messages.showError("Couldn't connect to the internet!");
        this.localRefresh();
      }).add(() => {
        if(refresher) refresher.complete();
        if(!!this.l){ this.l.dismiss(); this.l = null; }
      });
    })
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
