import { Component } from '@angular/core';
import { IonicPage, NavParams, ViewController } from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';

@IonicPage()
@Component({
  selector: 'page-article',
  templateUrl: 'article.html',
})
export class ArticlePage {
  article:any = {title:"",description:"",rawDescription:""}
  constructor(public viewCtrl: ViewController, public navParams: NavParams, public iab: InAppBrowser) {
    this.article = this.navParams.get("article");
  }

  ngOnInit() {
    document.getElementById("article-content").addEventListener("click", (e:any) => {
      e = e ||  window.event;
      let element:any = e.target || e.srcElement;

      if (element.tagName == 'A') {
        this.iab.create(element.href, "_system");
        return false;
      }
      else if(element.parentNode.tagName =='A') {
        this.iab.create(element.parentNode.href, "_system");
        return false;
      }
    });
    document.getElementById("article-content").innerHTML = this.article.rawDescription;
  }

  close() {
    this.viewCtrl.dismiss();
  }
}
