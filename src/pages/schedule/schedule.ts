import { Component } from '@angular/core';
import { IonicPage, NavController, Gesture, Events, MenuController } from 'ionic-angular';

import { TodoPage } from '../todo/todo';

import { DateFunctionsProvider } from '../../providers/date-functions/date-functions';
import { LetterDayProvider } from '../../providers/letter-day/letter-day';
import { ScheduleProvider } from '../../providers/schedule/schedule';
import { MyScheduleProvider } from '../../providers/my-schedule/my-schedule';
import { MessagesProvider } from '../../providers/messages/messages';
import { SettingsProvider } from '../../providers/settings/settings';



@IonicPage()
@Component({
  selector: 'page-schedule',
  templateUrl: 'schedule.html',
})
export class SchedulePage {
  classes:Array<any> = [];
  curDay:Date = new Date();
  curISOday:string = "";
  maxISOday:string;
  minISOday:string;
  letter:string = "";
  periodList:string = "";
  schedRefreshOverride:boolean = false;
  gesture:Gesture;
  ddd:string = "";
  constructor(public navCtrl: NavController, public dfp:DateFunctionsProvider, public messages: MessagesProvider, public events: Events,
              public letterDay:LetterDayProvider, public schedule:ScheduleProvider, public mySched:MyScheduleProvider, public menu:MenuController, public settings:SettingsProvider) {

    this.maxISOday = this.dateToISO(new Date(Date.now()+2*12*30*24*60*60*1000));
    this.minISOday = this.dateToISO(new Date(2015, 8, 1));
    this.minISOday = "2015-09-01"
    this.maxISOday = (new Date().getFullYear() + 1)+"-08-31";
    this.events.subscribe("scheduleRefreshComplete", result => {
      if(result.success || this.letter == "refreshing"){
        this.refresh();
      }else{
        this.messages.showError("Couldn't connect to the internet!");
      }
    })

    this.events.subscribe("letterRefreshComplete", result => {
      if(result.success){
        this.refresh();
      }else{
        this.messages.showError("Couldn't connect to the internet!");
      }
    });

    this.events.subscribe("myClassesReady", () => this.refresh())

    this.events.subscribe("remoteOverrideRefresh", () => {
      console.log("override refreshing");
      this.refresh();
    })

    this.letterDay.getNextDatesOf("A");
  }

  ionViewDidEnter(){
    this.menu.swipeEnable(false, "main-menu");
  }

  ionViewWillLeave(){
    this.menu.swipeEnable(true, "main-menu");
  }

  dateChange(){
    this.curDay = this.ISOtoDate(this.curISOday);
    this.updateDate();
  }

  dateToISO(date){
    return date.getFullYear()+"-"+
      (date.getMonth()+1<10?"0":"")+(date.getMonth()+1)+"-"+
      (date.getDate()<10?"0":"")+date.getDate()+"T"+
      (date.getHours()<10?"0":"")+date.getHours()+":"+
      (date.getMinutes()<10?"0":"")+date.getMinutes()+":00";
  }

  ISOtoDate(str){
    return new Date(str.substring(0,4), (parseInt(str.substring(5,7))-1), str.substring(8,10), str.substring(11,13), str.substring(14, 16));
  }

  dddHelp() {
    switch(this.ddd){
      case "charity":
        this.messages.popup("Charity Dress Down Day", "Pay money to a good cause to dress down.");
        break;
      case "spirit":
        this.messages.popup("Spirit Dress Down Day", "Special dress down day today! Check the announcements for more information on what to wear.");
        break;
      case "free":
        this.messages.popup("Free Dress Down Day", "Dress down this day for free!");
        break;
      case "fancy":
        this.messages.popup("Dress Up Day", "Please dress up this day.");
        break;
      default:
        break;
    }
  }

  isLetter(str){
    return str == "A" || str == "B" || str == "C" || str == "D" || str == "E" || str == "F" || str == "G" || str=="R";
  }

  formatDate(d){
    //If the current day is the same as today, just say that it's today
    let now = new Date();
    if(d.getDate() == now.getDate() && d.getMonth() == now.getMonth() && d.getFullYear() == now.getFullYear()){
      return "Today"
    }
    //Otherwise, return the whole date
    const year = d.getFullYear();
    const month = this.dfp.monthNames[d.getMonth()];
    const day = d.getDate();
    const weekday = this.dfp.weekDays[d.getDay()];
    return weekday+", "+month+" "+day+" "+year;
  }

  refresh(){
    //Dress Down Days
    this.ddd = this.settings.ddd[this.dfp.dateToDayString(this.curDay)];
    //Stores the schedule for the day
    this.classes = [];
    //Stores the letter day
    this.letter = this.letterDay.letter();
    //If today is a valid letter day
    if(this.letter == "R"){
      for(let i = 0; i < this.schedule.getTypes().length; i++){
        if(this.schedule.getTypes()[i].name == "Review Day"){
          this.schedule.setCurrentType(i);
        }
      }
    }
    if(this.letter !== undefined && this.letter.length == 1 && this.isLetter(this.letter)){
      for(let i = 0; i < this.schedule.getToday().length; i++){
        //Fix pass by refrence by converting it to and back from a string
        let tClass = JSON.parse(JSON.stringify(this.schedule.get(i)));
        tClass.color = undefined;
        //If you have a swap class, deals with it by recalling this function with the correct option
        if(tClass.type == "swap"){
          //If you have first lunch
          if(!tClass.determinant){
            if(!this.mySched.get("block", this.letterDay.classes()[2]) || this.mySched.get("block", this.letterDay.classes()[2]).firstLunch){
              tClass = tClass.options[0];
            }
            else{ //Second Lunch
              tClass = tClass.options[1];
            }
          }else{
            if(!this.mySched.get("block", tClass.determinant) || this.mySched.get("block", tClass.determinant).firstLunch){
              tClass = tClass.options[0];
            }
            else{ //Second Lunch
              tClass = tClass.options[1];
            }
          }
        }

        //If you have a block type class
        if(tClass.type == "block" || tClass.type == "staticblock"){
          var blockNum = tClass.type=="block"?this.letterDay.classes()[tClass.id-1]:tClass.id;
          if(this.mySched.get("block", blockNum) == undefined){
            tClass.name = "Block "+blockNum;
          }else{
            tClass.color = this.mySched.get("block", blockNum).color;
            tClass.name = this.mySched.get("block", blockNum).name;
            tClass.clickUrl = this.mySched.get("block", blockNum).time.id;
          }
        }
        //If you have a Community Time type class
        else if(tClass.type == "CT"){
          if(tClass.name !== "Assembly"){
            tClass.name = this.schedule.getCTSchedule();
          }
        }
        //If you have a flex type class
        else if(tClass.type == "flex" || tClass.type == "specialflex"){
          //Gets all flex classes
          var flexes = this.mySched.getAllType("flex");
          //Variable to check whether to append or overwrite the current name
          var modified = false;
          //Iterate through the list for scheudled flex meetings
          for(let j=0; j < flexes.length; j++){
            //If the day of the week or the letter day matches and this is the right flex
            if((flexes[j].time.day == this.letterDay.letter() || flexes[j].time.day == this.letterDay.dayOfWeek()) && tClass.id == flexes[j].time.id){
              if(modified){
                tClass.name += " & "+flexes[j].name;
              }else{
                tClass.name = flexes[j].name;
                modified = true;
              }
              tClass.color = flexes[j].color;
            }
          }
          if(tClass.type =="flex"){
            var adjBlock;
            //If this is first flex
            if(tClass.id == 1){
              //Checks to see if first period takes flex
              adjBlock = this.mySched.get("block", this.letterDay.classes()[0]);
              if(adjBlock !== undefined && (adjBlock.takesFlex == "both" || adjBlock.takesFlex == "cp" || adjBlock.takesFlex == "after")){
                if(modified){
                  tClass.name += " & "+adjBlock.name;
                }else{
                  tClass.name = adjBlock.name;
                  modified = true;
                }
                tClass.color = adjBlock.color;
              }
            }
            //If this is second flex (It's a 0 because addClass persistence requires a boolean value which is either a 0 or a 1)
            else if(tClass.id == 0){
              //Checks if 3rd class of the day takes the flex
              adjBlock = this.mySched.get("block", this.letterDay.classes()[2]);
              if(adjBlock !== undefined && (adjBlock.takesFlex == "both" || adjBlock.takesFlex == "cp" || adjBlock.takesFlex == "after")){
                tClass.color = adjBlock.color;
                if(modified){
                  tClass.name += " & "+adjBlock.name;
                }else{
                  tClass.name = adjBlock.name;
                  modified = true;
                }
              }

              //Checks if the 4th class of the day takes the flex
              adjBlock = this.mySched.get("block", this.letterDay.classes()[3]);
              if(adjBlock !== undefined && (adjBlock.takesFlex == "both" || adjBlock.takesFlex == "cp" || adjBlock.takesFlex == "before")){
                tClass.color = adjBlock.color;
                if(modified){
                  tClass.name += " & "+adjBlock.name;
                }else{
                  tClass.name = adjBlock.name;
                  modified = true;
                }
              }
            }
          }
        }
        //If you have a Conference Period Type Class
        else if(tClass.type == "CP"){
          //Gets the current assembly schedule for scheduled CP's
          tClass.name = this.schedule.getCPSchedule();

          adjBlock = this.mySched.get("block", this.letterDay.classes()[3]);
          if(adjBlock !== undefined && adjBlock.takesFlex == "cp"){
            tClass.color = adjBlock.color;
            if(tClass.name == "CP"){
              tClass.name = adjBlock.name;
            }else{
              tClass.name += " & "+adjBlock.name;
            }
          }

          //Gets user scheduled CP's
          var CPs = this.mySched.getAllType("CP");
          //Iterate through user scheduled CP's
          for(let j=0; j < CPs.length; j++){
            //If the letter day or weekday line up
            if(CPs[j].time.day == this.letterDay.letter() || CPs[j].time.day == this.letterDay.dayOfWeek()){
              tClass.color = CPs[j].color;
              if(tClass.name == "CP"){
                tClass.name = CPs[j].name; //Overwrites if newName hasn't been set yet
              }else{
                tClass.name += " & "+CPs[j].name; //Otherwise, appends
              }
            }
          }
        }

        if(tClass.color === undefined){
          if(tClass.type == "block"){
            tClass.color = "#fbb";
          }else if(tClass.type == "flex"){
            tClass.color = "#fff";
          }else if(tClass.type == "CT"){
            tClass.color = "#bfffff";
          }else if(tClass.type == "Lunch"){
            tClass.color = "#ddd";
          }else if(tClass.type == "CP"){
            tClass.color = "#bdfdc8";
          }else {
            tClass.color = "#ddd";
          }
        }
        this.classes.push(tClass);
      }


      if(this.letter == "R"){
        this.periodList = "Review";
      }else{
        //Add a dash between each of the classes in the class list for friendly display
        let c = "";
        for(let i=0; i < this.letterDay.classes().length; i++){
          c+=this.letterDay.classes()[i];
          if(i+1 < this.letterDay.classes().length){
            c+="-";
          }
        }
        this.periodList = c;
      }

      if(this.schedule.getCurrentScheduleName() == "Unknown Assembly"){
        this.messages.popup("Unknown Assembly Schedule", "This day has an assembly schedule that is not recognized.\n"+
              "A normal schedule is shown, but please only use it as a guideline.");
      }else if(this.letter == "R"){
        this.periodList = "Review";
      }

    }
    //If today is not a valid letter day
    else{
      //If there is no stored letter day schedule
      if(this.letter == "empty"){
        //If not connected to the internet
        this.schedule.refresh().add(val => {
          if(!val){
            this.messages.showError("Couldn't connect to the internet!");
          }
        });
        this.letterDay.refresh().add(val => {
          if(!val){
            this.messages.showError("Couldn't connect to the internet!");
          }
        });
      }
      else if(this.letter == "refreshing"){
        this.messages.showNormal("Refreshing...");
      }
    }
    console.log(this.letter);
  }

  swipeEvent(e:any){
    if(e.isFinal){
      if(Math.abs(e.deltaX) > Math.abs(e.deltaY)){
        if(e.deltaX > 0) this.prevDay();
        else this.nextDay();
      }
    }
  }

  //Updates the date in the Letterday and Schedule functions to match the time the user selected
  //Refreshes the schedule
  updateDate(){
    this.curISOday = this.dateToISO(this.curDay);
    this.letterDay.updateDay(this.curDay);
    this.schedule.changeDay(this.curDay);
    this.refresh();
  }

  ionViewDidLoad(){
    this.curDay = new Date();
    this.updateDate();
  }
  //Resets the current day to today
  ionViewWillEnter(){
    //resets the schedule to the current date
    if(!this.schedRefreshOverride){
      this.curDay = new Date();
      this.updateDate();
    }
    this.schedRefreshOverride = false;
  }

  //Reset the current day to today
  resetDate(){
    this.curDay = new Date();
    //$cordovaDeviceFeedback.haptic(0);
    this.updateDate();
  }

  //Formats the time for classes in 12 hour format
  formatTime(str:string){
    //Compensate for special events that don't have a time
    if(str == "" || str == undefined){
      return str;
    }
    let hour = parseInt(str.substring(0,2));
    let minute = parseInt(str.substring(3,5));
    if(hour > 12){
      hour -= 12;
    }
    return hour + ":" + (minute<10?"0":"") + minute;
  }

  //Jumps to the next day
  nextDay(){
    this.curDay.setDate(this.curDay.getDate()+1);
    this.updateDate();
  }

  //Jumps to the previous day
  prevDay(){
    this.curDay.setDate(this.curDay.getDate()-1);
    this.updateDate();
  }

  clickedClass(cls){
    if(!!cls.clickUrl){
      this.schedRefreshOverride = true;
      this.navCtrl.push(TodoPage, {"blockNum":cls.clickUrl});
    }
  }

}
