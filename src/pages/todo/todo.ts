import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, Content } from 'ionic-angular';

import { DateFunctionsProvider } from '../../providers/date-functions/date-functions';
import { LetterDayProvider } from '../../providers/letter-day/letter-day';
import { ScheduleProvider } from '../../providers/schedule/schedule';
import { MyScheduleProvider } from '../../providers/my-schedule/my-schedule';
import { MessagesProvider } from '../../providers/messages/messages';


/**
 * Generated class for the AboutPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-todo',
  templateUrl: 'todo.html',
})
export class TodoPage {
  @ViewChild(Content) content:Content;
  classes:Array<any>;
  constructor(public navCtrl: NavController, public navParams:NavParams, public dfp:DateFunctionsProvider, public messages: MessagesProvider, public events: Events,
              public letterDay:LetterDayProvider, public schedule:ScheduleProvider, public mySched:MyScheduleProvider) {
    this.refresh();
  }

  ionViewDidEnter(){
    const blockNum = this.navParams.get("blockNum");
    if(this.navParams.get("blockNum") != undefined){
      let elem:HTMLElement = document.getElementById("todo-class-"+blockNum);
      this.content.scrollTo(0, elem.offsetTop - 5, 300);
      var color = this.mySched.get("block", blockNum).color;
      if(color == "#fff" || color == "#FFF" || color == "#ffffff" || color == "#FFFFFF"){
        elem.style.border = "1px solid white";
        elem.style["border-color"] = "#000"
        window.setTimeout(()=>{elem.style["border-color"] = "#fff"}, 500);
      }else{
        elem.style["background-color"] = color;
        window.setTimeout(()=>{elem.style["background-color"] = "#fff"}, 500);
      }
    }
  }

  refresh() {
    let startingClass;
    let nextDate = this.letterDay.nextLetterDayDate(new Date());
    console.log(nextDate);
    let scheduleCurrentDay = this.schedule.getCurrentDay();
    console.log(nextDate);
    if(nextDate !== undefined){
      var classes = this.letterDay.classesOf(nextDate);
      if(this.dfp.dateToDayString(nextDate) == this.dfp.dateToDayString(new Date())){
        var sched = this.schedule.getForDay(nextDate);
        for(var j = 0; j < sched.length; j++){
          thisClass = sched[j];
          if(sched[j].type == "swap"){
            if(!this.mySched.get("block", classes[2]) || this.mySched.get("block", classes[2]).firstLunch){
              thisClass = thisClass.options[0];
            }else{
              thisClass = thisClass.options[1];
            }
          }
          if(thisClass.type == "block"){
            var d = new Date();
            d.setHours(parseInt(thisClass.endTime.substring(0,2)));
            d.setMinutes(parseInt(thisClass.endTime.substring(3,5)));
            if(d.getTime() > nextDate.getTime()){
              startingClass = classes[parseInt(thisClass.id) - 1];
              break;
            }
          }
        }
        if(startingClass == undefined){
          nextDate.setDate(nextDate.getDate()+1);
          nextDate = this.letterDay.nextLetterDayDate(nextDate);
          if(nextDate == undefined){
            startingClass = 1;
          }else{
            startingClass = this.letterDay.classesOf(nextDate)[0];
          }
        }
      }
      else{
        startingClass = classes[0];
      }
      this.schedule.changeDay(scheduleCurrentDay);
    }else{
      startingClass = 1;
    }

    var classList = [];
    for(var i = 0; i < 7; i++){
      var thisClass = this.mySched.get("block", (startingClass-1+i)%7 + 1);
      if(thisClass != undefined){
        classList.push(thisClass);
      }
    }

    for(var i = 0; i < classList.length; i++){
      for(var j = 0; j < classList[i].tasks.length; j++){
        if(classList[i].tasks[j].completed == true){
          classList[i].tasks.splice(j, 1);
          j--;
        }
      }
    }
    this.classes = classList;
  }

  formatDate (str){
    if(!str){
      return "";
    }
    return parseInt(str.substring(4, 6))+"/"+parseInt(str.substring(6,8));
  }

  addTask(elem, clsIndex){
    if(elem.value != ""){
      this.classes[clsIndex].tasks.push({name:elem.value, date:"", completed:false});
      elem.value = "";
    }
    elem.parentNode.parentNode.style.opacity = "0.5";
    this.mySched.save();
  }

  removeTask(taskIndex, clsIndex, elem) {
    elem.parentNode.style.opacity = "0";
    window.setTimeout(() => {
      if(elem.parentNode.style.opacity == "0"){
        this.classes[clsIndex].tasks.splice(taskIndex, 1);
        this.mySched.save();
      }
    }, 1000);
  }

  readdTask(elem) {
    elem.parentNode.style["transition-duration"] = '0s';
    elem.parentNode.style.opacity = 1;
    setTimeout(()=>elem.parentNode.style["transition-duration"] = '1s', 5);
  }

  oldTaskUnfocus(val, taskIndex, clsIndex){
    if(val == ""){
      this.classes[clsIndex].tasks.splice(taskIndex, 1);
    }
    this.mySched.save();
  }

  oldClassKeypress(e){
    if(e.keyCode == 13){
      e.target.blur();
      this.mySched.save();
    }
  }

  newClassKeypress(e, clsId){
    console.log(e.target);
    if(e.keyCode == 13 || e.target.value == ""){
      this.newTaskUnfocus(e.target, clsId);
    }else if(e.target.value != ""){
      e.target.parentNode.parentNode.style.opacity = 1;
    }
  };

  newTaskUnfocus(elem, clsId) {
    if(elem.value != ""){
      this.classes[clsId].tasks.push({name:elem.value, date:"", completed:false});
      elem.value = "";
    }
    elem.parentNode.parentNode.style.opacity = 0.5;
    this.mySched.save();
  }

  newTaskFocus(elem) {
    elem.parentNode.parentNode.style.opacity = 1;
  }
}
