import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

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
  subscriptions:string[];
  athleticMaps:boolean;
  pages:{title:string}[] = [];
  selectedPage:number = 0;
  possiblePages:{title:string}[] = [];
  hiddenPages:{title:string}[] = [];
  constructor(public navCtrl: NavController, public iab:InAppBrowser, public settings:SettingsService,
     public messages:MessagesService, public schedule:ScheduleService, public letterDay:LetterDayService) { }

  ngOnInit() {
    this.athleticCalendars = this.settings.getAthleticCalendars();
    this.settings.getAthleticSubscriptions().then((s) => this.subscriptions = s);
    this.settings.getPages().then(vals => {
      this.pages = vals.pages;
      this.selectedPage = vals.startPageIndex;
      this.possiblePages = this.settings.possiblePages;
      this.updateHiddenPages();
    })
    this.athleticMaps = this.settings.getAthleticMaps();
  }

  updatePages(){
    let elems = document.getElementById("menuPageReorder").children;
    let newPages = [];
    for(var i = 0; i < elems.length; i++){
      if(elems[i].classList.contains("divider")) break;
      if(elems[i].attributes.getNamedItem("data-hiddenPage").value == "true"){
        newPages.push(this.hiddenPages[elems[i].attributes.getNamedItem("data-index").value]);
      }else{
        newPages.push(this.pages[elems[i].attributes.getNamedItem("data-index").value]);
      }
    }
    this.pages = newPages;
    console.log(this.pages);
    this.updateHiddenPages();
    this.settings.savePages(this.pages, this.selectedPage).then(() => {
      this.messages.showNormal("Order Updated");
    });
  }

  updateHiddenPages(){
    this.hiddenPages = [];
    for(var i = 0; i < this.possiblePages.length; i++){
      let found = false;
      for(var j = 0; j < this.pages.length; j++){
        if(this.possiblePages[i].title == this.pages[j].title){
          found = true; break;
        }
      }
      if(!found) this.hiddenPages.push(this.possiblePages[i]);
    }
  }

  openClassManagement(){
    this.navCtrl.goForward("/classManage");
  }

  //Updates the athletic maps option to true or false
  updateAthleticSubscription(elem){
    console.log(elem.value);
    this.subscriptions = elem.value;
    if(this.subscriptions.indexOf("-1")!=-1 || this.subscriptions.length == 0){
      this.messages.showNormal("Subscribed to all calendars");
      this.subscriptions = ["-1"];
    }
    elem.value = this.subscriptions;
    console.log(elem.value);
    this.settings.setAthleticSubscription(this.subscriptions);
  }

  updateAthleticMaps(val){
    this.settings.setAthleticMaps(val);
  }

}
