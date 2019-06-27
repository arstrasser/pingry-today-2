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
  possibleClassClickActions:string[];
  constructor(private navCtrl: NavController, private settings:SettingsService,
     private messages:MessagesService, private user:UserService, private modalCtrl:ModalController) { }

  ngOnInit() {
    //Update all the object properties from the settings service
    this.athleticCalendars = this.settings.getAthleticCalendars();
    this.settings.getAthleticSubscriptions().then(s => this.subscriptions = s);
    this.settings.getClassClickAction().then(action => this.classAction = action);
    this.settings.getPages().then(vals => {
      this.pages = vals.pages;
      this.possiblePages = this.settings.possiblePages;
      this.updateHiddenPages();
    })
    this.athleticMaps = this.settings.getAthleticMaps();
    this.possibleClassClickActions = this.settings.possibleClassClickActions;
  }

  onReorder(e){
    //After reordering the list of classes
    e.detail.complete(true);
    this.updatePages();
  }

  updatePages(){
    //Update the page list
    let elems = document.getElementById("menuPageReorder").children;
    let newPages = [];
    for(var i = 0; i < elems.length; i++){
      //If the element is a divider, skip it
      if(elems[i].classList.contains("divider")) break;
      if(elems[i].attributes.getNamedItem("data-hiddenPage").value == "true"){
        newPages.push(this.hiddenPages[elems[i].attributes.getNamedItem("data-index").value]);
      }else{
        newPages.push(this.pages[elems[i].attributes.getNamedItem("data-index").value]);
      }
    }
    this.pages = newPages;
    this.updateHiddenPages();
    this.settings.savePages(this.pages).then(() => {
      this.messages.showNormal("Order Updated");
    });
  }

  //Update the list of hidden pages
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
    if(elem.value.indexOf("-1")!=-1|| elem.value.length == 0){
      this.messages.showNormal("Subscribed to all calendars");
      if(elem.value.length != 1){
        elem.value = ["-1"];
      }
    }
    this.subscriptions = elem.value;

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
