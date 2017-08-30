import { Component } from '@angular/core';
import { IonicPage, NavParams, ViewController } from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';

@IonicPage()
@Component({
  selector: 'page-announcements-popup',
  templateUrl: 'announcements-popup.html',
})
export class AnnouncementsPopupPage {
  announcement:any = {title:"",description:"",rawDescription:""}
  constructor(public viewCtrl: ViewController, public navParams: NavParams, public iab: InAppBrowser) {
    this.announcement = this.navParams.get("announcement");
  }

  ngOnInit() {
    document.getElementsByTagName("page-announcements-popup")[0].addEventListener("click", (e) => {
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
    document.getElementById("announcement-content").innerHTML = this.announcement.rawDescription;
  }

  close() {
    this.viewCtrl.dismiss();
  }
}
