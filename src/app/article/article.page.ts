import { Component, OnInit } from '@angular/core';
import { NavParams, NavController } from '@ionic/angular';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';


@Component({
  selector: 'app-article',
  templateUrl: './article.page.html',
  styleUrls: ['./article.page.scss'],
})
export class ArticlePage implements OnInit {
  article:any = {title:"",description:"",rawDescription:""}
  constructor(public navCtrl: NavController, public navParams: NavParams, public iab: InAppBrowser) {}

  ngOnInit() {
    //Get the details on the article from the navigation parameters.
    this.article = this.navParams.get("article");
    document.getElementById("article-content").addEventListener("click", (e:any) => {
      //Override the click event on links to use in app browser.
      e = e ||  window.event;
      let element:any = e.target || e.srcElement;

      //If you are clicking on an <a> tag for a link
      if (element.tagName == 'A') {
        this.iab.create(element.href, "_system");
        return false;
      }
      //If you are clicking on the child of an <a> tag for a link
      else if(element.parentNode.tagName =='A') {
        this.iab.create(element.parentNode.href, "_system");
        return false;
      }
    });
    document.getElementById("article-content").innerHTML = this.article.rawDescription;
  }

  close() {
    document.querySelector('ion-modal-controller').dismiss();
  }

}
