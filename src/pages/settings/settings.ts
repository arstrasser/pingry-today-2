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
  refreshEnable:boolean = true;
  athleticCalendars:Array<any>;
  selectedAthleticCalendar:string;
  athleticMaps:boolean;
  constructor(public navCtrl: NavController, public navParams: NavParams, public iab:InAppBrowser, public settings:SettingsProvider,
     public messages:MessagesProvider, public schedule:ScheduleProvider, public letterDay:LetterDayProvider) {

       this.athleticCalendars = this.settings.getAthleticCalendars();
       this.selectedAthleticCalendar = this.settings.getAthleticSubscription();
       this.athleticMaps = this.settings.getAthleticMaps();
  }

  openClassManagement(){
    this.navCtrl.push(ClassManagePage);
  }

  calendarRefresh(){
    //Only refresh if not currently refreshing
    if(this.refreshEnable){
      this.messages.showNormal("Refreshing...");
      this.refreshEnable = false;
      this.schedule.refresh(val=>{
        if(val){
          this.messages.showSuccess("Success!");
        }else{
          this.messages.showError("Couldn't connect to the internet!");
        }
        this.refreshEnable = true;
      });
    }
  }

  letterRefresh(){
    //Only refresh if not currently refreshing
    if(this.refreshEnable){
      this.messages.showNormal("Refreshing...");
      this.refreshEnable = false;
      this.letterDay.refresh(val => {
        if(val){
          this.messages.showSuccess("Success!");
        }else{
          this.messages.showError("Couldn't connect to the internet!");
        }
        this.refreshEnable = true;
      });
    }
  }

  //Updates the athletic maps option to true or false
  updateAthleticSubscription(val){
    this.settings.setAthleticSubscription(val);
  }

  updateAthleticMaps(val){
    this.settings.setAthleticMaps(val);
  }
}
