import { Component, OnInit } from '@angular/core';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { AppVersion } from '@ionic-native/app-version/ngx';

@Component({
  selector: 'app-about',
  templateUrl: './about.page.html',
  styleUrls: ['./about.page.scss'],
})
export class AboutPage implements OnInit {
  appVersion:string = "Loading...";
  constructor(public iab:InAppBrowser, public av:AppVersion) {}

  openHelp(){
    this.iab.create("http://www.pingry.org/hp/pingry-today-app-support", '_system');
  }

  ngOnInit() {
    this.av.getVersionNumber().then((num)=>this.appVersion = num);
  }

}
