import { Component } from '@angular/core';
import { IonicPage, ModalController, LoadingController } from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { Http } from '@angular/http';
import { Observable }     from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { ArticlePage } from '../article/article';

import { FeedParseProvider } from '../../providers/feed-parse/feed-parse';
import { MessagesProvider } from '../../providers/messages/messages';



@IonicPage()
@Component({
  selector: 'page-news',
  templateUrl: 'news.html',
})
export class NewsPage {
  news:Array<any> = [];
  l:any;
  constructor(public iab: InAppBrowser, public http:Http, public modalCtrl: ModalController, public loadingCtrl:LoadingController,
     public feedParse:FeedParseProvider, public messages: MessagesProvider) {

    this.localRefresh();
    const lastRefresh = localStorage.getItem("newsRSSRefreshTime");
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
    Observable.forkJoin([
      this.http.get("http://www.pingry.org/rss.cfm?news=13&d="+Date.now()).map(data => this.feedParse.parseRSS(data.text())),
      this.http.get("http://www.pingry.org/rss.cfm?news=14&d="+Date.now()).map(data => this.feedParse.parseRSS(data.text()))
    ]).subscribe((values) => {
      let obj = values[0].concat(values[1]);
      obj.sort(function(a, b){
        return parseInt(a.date) < parseInt(b.date) ? 1: -1;
      });
      localStorage.setItem("newsRSS", JSON.stringify(obj));
      localStorage.setItem("newsRSSRefreshTime", ""+Date.now());
      this.news = obj;
    }, ()=> this.messages.showError("Couldn't connect!")).add(() =>{
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
