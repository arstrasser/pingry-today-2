import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { AppVersion } from '@ionic-native/app-version';

@IonicPage()
@Component({
  selector: 'page-about',
  templateUrl: 'about.html',
})
export class AboutPage {
  appVersion:string = "Loading...";
  constructor(public iab:InAppBrowser, public av:AppVersion) {
    this.av.getVersionNumber().then((num)=>this.appVersion = num);
  }

  openHelp(){
    this.iab.create("http://www.pingry.org/hp/pingry-today-app-support", '_system');
  }
}
