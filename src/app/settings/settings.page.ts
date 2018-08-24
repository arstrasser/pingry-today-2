import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from '@ionic/angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';

import { SettingsService } from '../settings.service';
import { MessagesService } from '../messages.service';
import { ScheduleService } from '../schedule.service';
import { LetterDayService } from '../letter-day.service';

import { ClassManagePage } from '../class-manage/class-manage.page';


@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
  athleticCalendars:Array<any>;
  subscriptions:number[];
  athleticMaps:boolean;
  constructor(public navCtrl: NavController, public navParams: NavParams, public iab:InAppBrowser, public settings:SettingsService,
     public messages:MessagesService, public schedule:ScheduleService, public letterDay:LetterDayService) { }

  ngOnInit() {
    this.athleticCalendars = this.settings.getAthleticCalendars();
    this.subscriptions = this.settings.getAthleticSubscriptions();
    this.athleticMaps = this.settings.getAthleticMaps();
  }

  openClassManagement(){
    this.navCtrl.goForward("/ClassManage");
  }

  //Updates the athletic maps option to true or false
  updateAthleticSubscription(){
    console.log(this.subscriptions);
    if(this.subscriptions.indexOf(-1)!=-1 || this.subscriptions.length == 0){
      this.messages.showNormal("Subscribed to all calendars");
      this.subscriptions = [-1];
    }
    this.settings.setAthleticSubscription(this.subscriptions);
  }

  updateAthleticMaps(val){
    this.settings.setAthleticMaps(val);
  }

}
