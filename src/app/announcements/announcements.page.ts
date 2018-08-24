import { Component, OnInit } from '@angular/core';
import { ModalController, LoadingController } from '@ionic/angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { Http } from '@angular/http';
import { map } from 'rxjs/operators';

import { AnnouncementsPopupPage } from '../announcements-popup/announcements-popup.page';

import { MessagesService } from '../messages.service';
import { SettingsService } from '../settings.service';


@Component({
  selector: 'app-announcements',
  templateUrl: './announcements.page.html',
  styleUrls: ['./announcements.page.scss'],
})
export class AnnouncementsPage implements OnInit {
  rss:Array<any> = [];
    l:any;
    constructor(public iab: InAppBrowser, public http:Http, public modalCtrl: ModalController,
       public settings: SettingsService, public messages: MessagesService, public loadingCtrl:LoadingController) { }

  ngOnInit(){
    this.l = this.loadingCtrl.create();
    this.l.present();
    this.refresh();
  }

  openSystemLink(url){
    this.iab.create(url, '_system')
  }

  //Refreshes the announcements
  refresh(refresher?){
    this.http.get("http://compsci.pingry.k12.nj.us:3000/v1/announcements?api_key="+this.settings.apiKey).pipe(map(data => data.json())).subscribe((data) => {
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
    let modal = this.modalCtrl.create({component:AnnouncementsPopupPage, componentProps:{announcement}}).then(modal => modal.present());
  }

}
