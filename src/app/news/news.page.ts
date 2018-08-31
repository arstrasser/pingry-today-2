import { Component, OnInit } from '@angular/core';
import { ModalController, LoadingController } from '@ionic/angular';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { Http } from '@angular/http';
import { map } from 'rxjs/operators';

import { ArticlePage } from '../article/article.page';

import { MessagesService } from '../messages.service';
import { SettingsService } from '../settings.service';


@Component({
  selector: 'app-news',
  templateUrl: './news.page.html',
  styleUrls: ['./news.page.scss'],
})
export class NewsPage implements OnInit {
  news:Array<any> = [];
  l:any;
  constructor(public iab: InAppBrowser, public http:Http, public modalCtrl: ModalController, public loadingCtrl:LoadingController,
     public messages: MessagesService, private settings:SettingsService) {}

  ngOnInit() {
    this.loadingCtrl.create().then((l) => {
      l.present();
      this.l = l;
      this.refresh();
    })

  }

  openSystemLink(url){
    this.iab.create(url, '_system')
  }

  //Refreshes the announcements
  refresh(refresher?){
    this.http.get("https://compsci.pingry.k12.nj.us:3001/v1/news?api_key="+this.settings.apiKey).pipe(map(data => data.json())).subscribe((data) => {
      localStorage.setItem("newsRSS", JSON.stringify(data));
      this.news = data;
    }, ()=> {
      this.localRefresh();
      this.messages.showError("Couldn't connect to the internet!")
    }).add(() =>{
      if(refresher) refresher.complete();
      if(!!this.l) { this.l.dismiss(); this.l = null; }
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
    let modal = this.modalCtrl.create({component: ArticlePage, componentProps:{article}}).then(modal => modal.present());
  }

}
