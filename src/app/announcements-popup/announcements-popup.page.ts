import { Component, OnInit } from '@angular/core';
import { NavParams, NavController } from '@ionic/angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';

@Component({
  selector: 'app-announcements-popup',
  templateUrl: './announcements-popup.page.html',
  styleUrls: ['./announcements-popup.page.scss'],
})
export class AnnouncementsPopupPage implements OnInit {
  announcement:any = {title:"",description:"",rawDescription:""}
  constructor(public navCtrl: NavController, public navParams: NavParams, public iab: InAppBrowser) {}

  ngOnInit() {
    this.announcement = this.navParams.get("announcement");
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
    document.querySelector('ion-modal-controller').dismiss();
  }
}
