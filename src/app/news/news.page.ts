import { Component, OnInit } from '@angular/core';
import { ModalController, LoadingController } from '@ionic/angular';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { Http } from '@angular/http';

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
    });
  }

  openSystemLink(url:string){
    this.iab.create(url, '_system')
  }

  //Refreshes the announcements
  refresh(refresher?){
    this.http.get("https://pingrytoday.pingry.org/v1/news?api_key="+this.settings.apiKey).subscribe((data) => {
      this.news = data.json();
      //Store the news locally as backup in case we go offline.
      localStorage.setItem("newsRSS", JSON.stringify(this.news));
    }, ()=> {
      this.localRefresh();
      this.messages.showError("Couldn't connect to the internet!")
    }).add(() =>{
      if(refresher) refresher.target.complete();
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
    //Opens an article and passes in the relevant information through navParams.
    this.modalCtrl.create({component: ArticlePage, componentProps:{article}}).then(modal => modal.present());
  }

}
