import { Component } from '@angular/core';
import { IonicPage, ViewController, NavParams, ActionSheetController, ModalController } from 'ionic-angular';

import { FullColorPickerPage } from '../full-color-picker/full-color-picker';
import { SettingsProvider } from '../../providers/settings/settings';
import { MessagesProvider } from '../../providers/messages/messages';
import { MyScheduleProvider } from '../../providers/my-schedule/my-schedule';

@IonicPage()
@Component({
  selector: 'page-edit-class',
  templateUrl: 'edit-class.html',
})
export class EditClassPage {
  cls:any = {"name":"", "color":"", "type":"", "firstLunch":false, "takesFlex":"", "firstFlex":true, "timeType":"", "time":{"day":"", "id":false}, "tasks":[]};;
  clsType:string;
  clsId:number;
  modifying:boolean = false;
  constructor(public viewCtrl: ViewController, public navParams: NavParams, public mySched:MyScheduleProvider, public settings:SettingsProvider,
     public messages:MessagesProvider, public actionSheetCtrl:ActionSheetController, public modalCtrl:ModalController) {

    this.clsType = navParams.get("clsType");
    this.clsId = navParams.get("clsId");
    //If we aren't passed parameters or we are passed invalid parameters that specify a class to modify
    if(this.clsType == undefined || this.clsType == "" || this.mySched.getAll()[this.clsType] == undefined || this.mySched.getAll()[this.clsType].length <= this.clsId){
      this.modifying = false;
    }else{
      //Modify a class
      this.modifying = true;
      //Get the class
      this.cls = JSON.parse(JSON.stringify(this.mySched.getAll()[this.clsType][this.clsId]));
    }
  }

  lunchHelp(e){
    this.messages.popup("First Lunch", "First lunch is for:\nScience, Health, Art, Math, and Economic Classes");
    e.cancelBubble = true;
  }

  takesFlexChange(){
    if(this.cls.takesFlex !== "" && this.cls.takesFlex !== "before"){
      this.cls.firstLunch = true;
    }
  }

  openColorPicker(){
    const colors = ["#ea3c3c", "#f9981f", "#fbf432", "#40ef40", "#40ff9f", "#56e8ff", "#1f78ff", "#c348e2", "#ff4d9e", "#e2e2e2", "#fff"];
    let buttons = [];
    for(let i = 0; i < colors.length; i++){
      let j = i;
      buttons.push({text:".", handler:() => {this.cls.color = colors[j]}, cssClass:"color-picker-"+i+" color-picker"})
    }
    buttons.push({text:"Other...", handler:()=>this.openFullColorPicker()})
    buttons.push({text:"Cancel", role:"cancel"});
    let alert = this.actionSheetCtrl.create({
      title:"Color Picker",
      buttons
    });
    alert.present();
  }

  openFullColorPicker(){
    let modal = this.modalCtrl.create(FullColorPickerPage, {color:this.cls.color});
    modal.present();
    modal.onDidDismiss((color) => {
      if(color){
        this.cls.color = color;
      }
    })
  }

  delete(){
    this.messages.confirm("Delete this class?", "", answer => {
      if(answer == true){
        this.mySched.removeClassById(this.clsType, this.clsId);
        this.mySched.save();
        this.viewCtrl.dismiss();
      }
    });
  }

  update (cls){
    this.mySched.removeClassById(this.clsType, this.clsId);
    this.mySched.addClass(cls)
    this.messages.showSuccess("Updated!");
    this.mySched.save();
    this.viewCtrl.dismiss();
  }

  submit(cls){
      this.mySched.addClass(cls);
      this.messages.showNormal("Class added!");
      this.mySched.save();
      this.viewCtrl.dismiss();
  }

  back(){
    this.viewCtrl.dismiss();
  }

  isValid(cls){
    //Class has a name
    if(cls.name == ""){
      return false;
    }
    //Color is selected
    if(cls.color == ""){
      return false;
    }
    //if the class is a block
    if(cls.type == "block"){
      //Makes sure you have a period selected and it's not a flex period
      return cls.time.id != "" && cls.time.id != false && cls.time.id !== true && (this.mySched.get("block", cls.time.id) == undefined ||
        (this.modifying && this.mySched.getAll()[this.clsType][this.clsId].type == "block" && this.mySched.getAll()[this.clsType][this.clsId].time.id == cls.time.id));
    }
    //If the class is a flex or a CP
    if(cls.type == "flex" || cls.type == "CP"){
      //Makes sure the timing type is set and that a day is selected
      return (cls.timeType == "letter" || cls.timeType == "weekday") && (cls.time.day !== "" && cls.time.day != undefined);
    }
    return false;
  }
}
