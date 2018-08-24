import { Component, ViewChild } from '@angular/core';

import { Platform, Nav } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { FCM } from '@ionic-native/fcm';

import { SchedulePage } from './schedule/schedule.page';
import { AnnouncementsPage } from './announcements/announcements.page';
import { AboutPage } from './about/about.page';
import { NewsPage } from './news/news.page';
import { AthleticsPage } from './athletics/athletics.page';
import { SettingsPage } from './settings/settings.page';
import { TodoPage } from './todo/todo.page';

import { MessagesService } from './messages.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  @ViewChild(Nav) nav: Nav;
  rootPage:any = SchedulePage;
  pages:Array<{title:string, page?:any, localUrl?:string, systemUrl?:string}> =
      [
          {title:"Schedule", page:SchedulePage},
          {title:"To Do List", page:TodoPage},
          {title:"News", page:NewsPage},
          {title:"Announcements", page:AnnouncementsPage},
  //        {title:"Activities Calendar", page:ClubCalendarPage},
          {title:"Athletics", page:AthleticsPage},
          {title:"Lunch Menu", localUrl:"http://www.sagedining.com/menus/pingry"},
          {title:"Web Portal", systemUrl:"https://www.pingry.org/pingrytoday"},
          {title:"Settings", page:SettingsPage},
          {title:"About", page: AboutPage}
      ];

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    public iab:InAppBrowser,
    public messages:MessagesService,
    public fcm: FCM
  ) {

    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      try {
        this.fcm.onNotification().subscribe(data => {
          console.log(data);
          if(data.text){ //Local notification uses .text instead of .body
            this.messages.popup(data.title, data.text);
          }else{
            this.messages.popup(data.title, data.body);
          }
        });
      }catch(e){console.warn("Unable to register FCM notification handler")}
    });
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
