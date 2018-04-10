import { Component } from '@angular/core';
import { IonicPage, ModalController, LoadingController } from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { Http } from '@angular/http';
import { Observable }     from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { ArticlePage } from '../article/article';

import { MessagesProvider } from '../../providers/messages/messages';
import { SettingsProvider } from '../../providers/settings/settings';



@IonicPage()
@Component({
  selector: 'page-news',
  templateUrl: 'news.html',
})
export class NewsPage {
  news:Array<any> = [];
  l:any;
  constructor(public iab: InAppBrowser, public http:Http, public modalCtrl: ModalController, public loadingCtrl:LoadingController,
     public messages: MessagesProvider, private settings:SettingsProvider) {

    this.l = this.loadingCtrl.create();
    this.l.present();
    this.refresh();
  }

  openSystemLink(url){
    this.iab.create(url, '_system')
  }

  //Refreshes the announcements
  refresh(refresher?){
    this.http.get("http://compsci.pingry.k12.nj.us:3000/news?api_key="+this.settings.apiKey).map(data => data.json()).subscribe((data) => {
      localStorage.setItem("newsRSS", JSON.stringify(data));
      this.news = data;
    }, ()=> {
      this.localRefresh();
      this.messages.showError("Couldn't connect to the internet!")
    }).add(() =>{
      if(refresher) refresher.complete();
      if(!!this.l) { this.l.dismissAll(); this.l = null; }
    });
  }

  //Locally refreshes from local storage
  localRefresh(){
    const obj = localStorage.getItem("newsRSS");
    if(obj != undefined){
      this.news = JSON.parse(obj);
    }
  }

  openArticle(article){
    let modal = this.modalCtrl.create(ArticlePage, {article});
    modal.present();
  }

}
