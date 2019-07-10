import { Component, OnInit } from '@angular/core';
import { ModalController, LoadingController } from '@ionic/angular';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { Http } from '@angular/http';

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
    this.loadingCtrl.create().then((l) => {
      l.present();
      this.l = l;
      this.refresh();
    });

  }

  openSystemLink(url:string){
    this.iab.create(url, '_system')
  }

  //Refreshes the announcements
  refresh(refresher?){
    this.http.get("https://pingrytoday.pingry.org/v1/announcements?api_key="+this.settings.apiKey).subscribe((data) => {
      this.rss = data.json()
      localStorage.setItem("announceRSS", JSON.stringify(this.rss));
    }, ()=>{
      this.localRefresh();
      this.messages.showError("Couldn't connect to the internet!")
    }).add(() =>{
      if(refresher){
        refresher.complete();
      }
      if(!!this.l){ this.l.dismiss(); this.l = null; }
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
    //Open a modal for the announcement and pass on the details on the announcement
    this.modalCtrl.create({component:AnnouncementsPopupPage, componentProps:{announcement}}).then(modal => modal.present());
  }

}
