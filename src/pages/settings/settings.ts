import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';

import { SettingsProvider } from '../../providers/settings/settings';
import { MessagesProvider } from '../../providers/messages/messages';
import { ScheduleProvider } from '../../providers/schedule/schedule';
import { LetterDayProvider } from '../../providers/letter-day/letter-day';

import { ClassManagePage } from '../class-manage/class-manage';


/**
 * Generated class for the AboutPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {
  athleticCalendars:Array<any>;
  subscriptions:number[];
  athleticMaps:boolean;
  constructor(public navCtrl: NavController, public navParams: NavParams, public iab:InAppBrowser, public settings:SettingsProvider,
     public messages:MessagesProvider, public schedule:ScheduleProvider, public letterDay:LetterDayProvider) {
       this.athleticCalendars = this.settings.getAthleticCalendars();
       this.subscriptions = this.settings.getAthleticSubscriptions();
       this.athleticMaps = this.settings.getAthleticMaps();
  }

  openClassManagement(){
    this.navCtrl.push(ClassManagePage);
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
