import { Component } from '@angular/core';

import { Platform, MenuController, Events } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { FCM } from '@ionic-native/fcm/ngx';
import { Router } from '@angular/router';

import { MyScheduleService } from './my-schedule.service';
import { MessagesService } from './messages.service';
import { SettingsService } from './settings.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  pages:Array<{title:string, page?:string, localUrl?:string, systemUrl?:string}> = [];
  startPageIndex = 0;
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    public iab:InAppBrowser,
    public messages:MessagesService,
    public fcm: FCM,
    public menuCtrl: MenuController,
    public m: MyScheduleService,  //Don't actually use, but gets all the classes loaded from storage
    public settings: SettingsService,
    public router:Router,
    private events:Events,
  ) {
    this.settings.getPages().then((vals) => {
      this.pages = vals.pages;
      this.startPageIndex = vals.startPageIndex;
      this.platform.ready().then(() => {
        //Open the first page
        this.openPage(this.pages[vals.startPageIndex]);
      });
    });

    //If we reorder the pages, update the menu
    this.events.subscribe("pagesUpdated", () => {
      this.settings.getPages().then((vals) => {
        this.pages = vals.pages;
      });
    })
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.splashScreen.hide();
      //Register for firebase notifications
      this.fcm.onNotification().subscribe(data => {
        console.log(data);
        if(data.text){ //Local notification uses .text instead of .body
          this.messages.popup(data.title, data.text);
        }else{
          this.messages.popup(data.title, data.body);
        }
      });
    });
  }

  openPage(p){
    this.menuCtrl.close();
    if(p.systemUrl){
      this.iab.create(p.systemUrl, "_system");
    }else if(p.localUrl){
      this.iab.create(p.localUrl, "_blank", {location:"yes",enableViewportScale:"yes"});
    }else if(p.page){
      this.router.navigateByUrl(p.page);
    }
  }
}
