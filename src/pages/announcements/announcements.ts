import { Component } from '@angular/core';
import { IonicPage, ModalController, LoadingController } from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import { AnnouncementsPopupPage } from '../announcements-popup/announcements-popup';

import { FeedParseProvider } from '../../providers/feed-parse/feed-parse';
import { MessagesProvider } from '../../providers/messages/messages';



@IonicPage()
@Component({
  selector: 'page-announcements',
  templateUrl: 'announcements.html',
})
export class AnnouncementsPage {
  rss:Array<any> = [];
  l:any;
  constructor(public iab: InAppBrowser, public http:Http, public modalCtrl: ModalController,
     public feedParse:FeedParseProvider, public messages: MessagesProvider, public loadingCtrl:LoadingController) {

    this.localRefresh();
    const lastRefresh = localStorage.getItem("pingryRSSRefreshTime");
    //If it's been over an hour, run a full refresh
    if(lastRefresh == null || lastRefresh =="" || (lastRefresh != null && lastRefresh != "" && parseInt(lastRefresh) + 360000 < Date.now())){
      this.l = this.loadingCtrl.create();
      this.l.present();
      this.refresh();
    }
  }

  openSystemLink(url){
    this.iab.create(url, '_system')
  }

  //Refreshes the announcements
  refresh(refresher?){
    this.http.get("http://www.pingry.org/rss.cfm?news=16&d="+Date.now()).map(data => data.text()).subscribe((data) => {
      var obj = this.feedParse.parseRSS(data);
      localStorage.setItem("announceRSS", JSON.stringify(obj));
      localStorage.setItem("announceRSSRefreshTime", ""+Date.now());
      this.rss = obj;
    }, ()=>this.messages.showError("Couldn't connect to the internet!")).add(() =>{
      if(refresher) refresher.complete();
      if(!!this.l){ this.l.dismissAll(); this.l = null; }
    });
  }

  //Locally refreshes from local storage
  localRefresh(){
    var obj = localStorage.getItem("announceRSS");
    if(obj != undefined){
      this.rss = JSON.parse(obj);
    }
  }

  openAnnounce(announcement){
    let modal = this.modalCtrl.create(AnnouncementsPopupPage, {announcement});
    modal.present();
  }

}
