import { Component } from '@angular/core';
import { IonicPage, ModalController, LoadingController } from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import { AnnouncementsPopupPage } from '../announcements-popup/announcements-popup';

import { MessagesProvider } from '../../providers/messages/messages';
import { SettingsProvider } from '../../providers/settings/settings';



@IonicPage()
@Component({
  selector: 'page-announcements',
  templateUrl: 'announcements.html',
})
export class AnnouncementsPage {
  rss:Array<any> = [];
  l:any;
  constructor(public iab: InAppBrowser, public http:Http, public modalCtrl: ModalController,
     public settings: SettingsProvider, public messages: MessagesProvider, public loadingCtrl:LoadingController) {

    this.l = this.loadingCtrl.create();
    this.l.present();
    this.refresh();
  }

  openSystemLink(url){
    this.iab.create(url, '_system')
  }

  //Refreshes the announcements
  refresh(refresher?){
    this.http.get("http://compsci.pingry.k12.nj.us:3000/v1/announcements?api_key="+this.settings.apiKey).map(data => data.json()).subscribe((data) => {
      localStorage.setItem("announceRSS", JSON.stringify(data));
      this.rss = data;
    }, ()=>{
      this.localRefresh();
      this.messages.showError("Couldn't connect to the internet!")
    }).add(() =>{
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
