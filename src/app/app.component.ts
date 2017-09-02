import { Component, ViewChild } from '@angular/core';
import { Platform, Nav } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { InAppBrowser } from '@ionic-native/in-app-browser';

import { SchedulePage } from '../pages/schedule/schedule';
import { AnnouncementsPage } from '../pages/announcements/announcements';
import { AboutPage } from '../pages/about/about';
//import { ClubCalendarPage } from '../pages/club-calendar/club-calendar';
import { NewsPage } from '../pages/news/news';
import { AthleticsPage } from '../pages/athletics/athletics';
import { SettingsPage } from '../pages/settings/settings';
import { TodoPage } from '../pages/todo/todo';

import { MessagesProvider } from '../providers/messages/messages';

declare var FCMPlugin:any;


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  rootPage:any = SchedulePage;
  pages:Array<{title:string, page?:any, localUrl?:string, systemUrl?:string}>
  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, public iab:InAppBrowser, public messages:MessagesProvider) {
    platform.ready().then(() => {
      try {
        FCMPlugin.onNotification(data => {
          console.log(data);
          if(data.text){ //Local notification uses .text instead of .body
            this.messages.popup(data.title, data.text);
          }else{
            this.messages.popup(data.title, data.body);
          }
        });
      }catch(e){console.warn("Unable to register FCM notification handler")}
      statusBar.styleDefault();
      splashScreen.hide();
    });
    this.pages = [
        {title:"Schedule", page:SchedulePage},
        {title:"To Do List", page:TodoPage},
        {title:"News", page:NewsPage},
        {title:"Announcements", page:AnnouncementsPage},
        //{title:"Club Calendar", page:ClubCalendarPage},
        {title:"Athletics", page:AthleticsPage},
        {title:"Lunch Menu", localUrl:"http://www.sagedining.com/menus/pingry"},
        {title:"Web Portal", systemUrl:"https://www.pingry.org/pingrytoday"},
        {title:"Settings", page:SettingsPage},
        {title:"About", page: AboutPage}
    ];
  }

  openPage(p){
    if(p.systemUrl){
      this.iab.create(p.systemUrl, "_system");
    }else if(p.localUrl){
      this.iab.create(p.localUrl, "_blank", {location:"yes",enableViewportScale:"yes"});
    }else if(p.page){
      this.nav.setRoot(p.page);
    }
  }
}
