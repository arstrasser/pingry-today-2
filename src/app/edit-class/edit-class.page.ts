import { Component, OnInit } from '@angular/core';
import { NavParams, ActionSheetController, ModalController, NavController } from '@ionic/angular';

import { FullColorPickerPage } from '../full-color-picker/full-color-picker.page';
import { SettingsService } from '../settings.service';
import { MessagesService } from '../messages.service';
import { MyScheduleService } from '../my-schedule.service';



@Component({
  selector: 'app-edit-class',
  templateUrl: './edit-class.page.html',
  styleUrls: ['./edit-class.page.scss'],
})
export class EditClassPage implements OnInit {
  //Default class configuation
  cls:any = {"name":"", "color":"", "type":"", "firstLunch":false, "takesFlex":"", "firstFlex":true, "timeType":"", "time":{"day":"", "id":false}, "tasks":[]};;
  clsType:string;
  clsId:number;
  modifying:boolean = false;
  constructor(public navParams: NavParams, public mySched:MyScheduleService, public settings:SettingsService,
     public navCtrl: NavController, public messages:MessagesService, public actionSheetCtrl:ActionSheetController, public modalCtrl:ModalController) {}


  ngOnInit() {
    //Get class information from the navigation parameters
    this.clsType = this.navParams.get("clsType");
    this.clsId = this.navParams.get("clsId");
    //If we aren't passed parameters or we are passed invalid parameters that specify a class to modify
    if(this.clsType == undefined || this.clsType == "" || this.mySched.getAll()[this.clsType] == undefined || this.mySched.getAll()[this.clsType].length <= this.clsId){
      this.modifying = false;
    }else{
      //Modify a class
      this.modifying = true;
      //Get the class
      this.cls = JSON.parse(JSON.stringify(this.mySched.getAll()[this.clsType][this.clsId]));
      this.updateColor(this.cls.color);
    }
  }

  lunchHelp(e){
    this.messages.popup("First Lunch", "First lunch is for:\nScience, Health, Art, Math, and Economic Classes");
    e.cancelBubble = true;
  }

  takesFlexChange(e){
    this.cls.takesFlex = e.target.value;
    //If the class takes flex, it should be first lunch so we can autofill that.
    if(this.cls.takesFlex !== "" && this.cls.takesFlex !== "before"){
      this.cls.firstLunch = true;
    }
  }

  updateColor(color){
    this.cls.color = color;
    //Force update the background color to be the selected color.
    document.getElementsByClassName("color-picker")[0].setAttribute("style", "--background:"+color);
  }

  //Open the generic action sheet with colors
  openColorPicker(){
    //The colors for easy selection
    const colors = ["#ea3c3c", "#f9981f", "#fbf432", "#40ef40", "#40ff9f", "#56e8ff", "#1f78ff", "#c348e2", "#ff4d9e", "#e2e2e2", "#fff"];
    let buttons = [];
    for(let i = 0; i < colors.length; i++){
      //Create a dummy variable here to help with function currying.
      let j = i;
      buttons.push({text:".", handler:() => {this.updateColor(colors[j])}, cssClass:"color-selection-"+i+" color-selection"})
    }
    //Opens the full color picker for manual selection
    buttons.push({text:"Other...", handler:()=>this.openFullColorPicker()})
    buttons.push({text:"Cancel", role:"cancel"});
    this.actionSheetCtrl.create({
      header:"Color Picker",
      buttons
    }).then(alert => alert.present());
  }

  openFullColorPicker(){
    //Manual selection of a custom color
    this.modalCtrl.create({component:FullColorPickerPage, componentProps:{color:this.cls.color}}).then(modal => {
      modal.present();
      modal.onDidDismiss().then((color) => {
        if(color.data){
          this.updateColor(color.data);
        }
      })
    });
  }

  delete(){
    this.messages.confirm("Delete this class?", "", (answer:boolean) => {
      if(answer == true){
        this.mySched.removeClassById(this.clsType, this.clsId);
        this.mySched.save();
        this.back();
      }
    });
  }

  //Update the class in the settings.
  update (cls){
    this.mySched.removeClassById(this.clsType, this.clsId);
    this.mySched.addClass(cls)
    this.messages.showSuccess("Updated!");
    this.mySched.save();
    this.back();
  }

  //Add the class to our classes.
  submit(cls){
    this.mySched.addClass(cls);
    this.messages.showNormal("Class added!");
    this.mySched.save();
    this.back();
  }

  //Cancel editing
  back(){
    this.modalCtrl.dismiss();
  }

  //Only allow updating/adding if the current class configuation is valid.
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
