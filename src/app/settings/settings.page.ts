import { Component, OnInit } from '@angular/core';
import { NavController, ModalController } from '@ionic/angular';

import { SettingsService } from '../settings.service';
import { MessagesService } from '../messages.service';
import { UserService } from '../user.service';

import { LoginPage } from '../login/login.page';


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
  possiblePages:{title:string}[] = [];
  hiddenPages:{title:string}[] = [];
  classAction:string = "todo";
  constructor(private navCtrl: NavController, private settings:SettingsService,
     private messages:MessagesService, private user:UserService, private modalCtrl:ModalController) { }

  ngOnInit() {
    this.athleticCalendars = this.settings.getAthleticCalendars();
    this.settings.getAthleticSubscriptions().then(s => this.subscriptions = s);
    this.settings.getClassClickAction().then(action => this.classAction = action);
    this.settings.getPages().then(vals => {
      this.pages = vals.pages;
      this.possiblePages = this.settings.possiblePages;
      this.updateHiddenPages();
    })
    this.athleticMaps = this.settings.getAthleticMaps();
  }

  onReorder(e){
    e.detail.complete(true);
    this.updatePages();
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
    this.settings.savePages(this.pages).then(() => {
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
    this.navCtrl.navigateForward("/classManage");
  }

  //Updates the athletic maps option to true or false
  updateAthleticSubscription(elem){
    this.subscriptions = elem.value;
    if(this.subscriptions.indexOf("-1")!=-1 || this.subscriptions.length == 0){
      this.messages.showNormal("Subscribed to all calendars");
      this.subscriptions = ["-1"];
    }
    elem.value = this.subscriptions;
    console.log(elem.value);
    this.settings.setAthleticSubscription(this.subscriptions);
  }

  updateClassAction(elem){
    this.classAction = elem.value;
    this.settings.setClassClickAction(this.classAction);
  }

  updateAthleticMaps(val){
    this.settings.setAthleticMaps(val);
  }

  isLoggedIn(){
    return this.user.isLoggedIn();
  }

  login(){
    this.modalCtrl.create({component:LoginPage}).then(modal => modal.present());
  }

  logout(){
    this.user.logout();
    this.messages.showNormal("Logged out");
  }
}
