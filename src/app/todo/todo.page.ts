import { Component, ViewChild, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Events, ModalController } from '@ionic/angular';

import { DateFunctionsService } from '../date-functions.service';
import { LetterDayService } from '../letter-day.service';
import { ScheduleService } from '../schedule.service';
import { MyScheduleService } from '../my-schedule.service';
import { MessagesService } from '../messages.service';
import { NotificationsService } from '../notifications.service';

import { TodoConfigPage } from '../todo-config/todo-config.page';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.page.html',
  styleUrls: ['./todo.page.scss'],
})
export class TodoPage implements OnInit {
  classes:Array<any>;
  timeouts:any = {};
  maxDay:string = "";
  minDay:string = "";
  constructor(public actRoute:ActivatedRoute, public dfp:DateFunctionsService, public messages: MessagesService, public events: Events,
              public letterDay:LetterDayService, public schedule:ScheduleService, public mySched:MyScheduleService, public modalCtrl:ModalController, public notifications:NotificationsService) { }

  ngOnInit() {
    this.refresh();
    this.maxDay = (new Date().getFullYear() + 1)+"-08-31";
    this.minDay = (new Date().getFullYear() - 1)+"-08-31";
  }

  ionViewDidEnter(){
    this.actRoute.params.subscribe(params => {
      const blockNum = params.blockNum;
      if(blockNum != undefined){
        let elem:HTMLElement = document.getElementById("todo-class-"+blockNum);
        //this.content.scrollToPoint(0, elem.offsetTop - 5, 300);
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
    })

  }

  //Refresh the list of todos
  refresh() {
    //Figure out what the next class is by time. (Next class in the day)
    let startingClass;
    //Get the next day (including today) that has classes.
    let nextDate = this.letterDay.nextLetterDayDate(new Date());
    console.log(nextDate);
    if(nextDate !== undefined){
      var classes = this.letterDay.classesOf(nextDate);
      //If today has classes, we have to figure out the next class based on time
      if(this.dfp.dateToDayString(nextDate) == this.dfp.dateToDayString(new Date())){
        var sched = this.schedule.getForDay(nextDate);
        //Loop through the schedule and find out the time of each class.
        for(var j = 0; j < sched.length; j++){
          thisClass = sched[j];
          //Deal with swap classes for lunch
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
            //If this class hasn't occured yet, we're done
            if(d.getTime() > nextDate.getTime()){
              startingClass = classes[parseInt(thisClass.id) - 1];
              break;
            }
          }
        }
        //If we didn't find a class, then the next class is tomorrow
        if(startingClass == undefined){
          nextDate.setDate(nextDate.getDate()+1);
          nextDate = this.letterDay.nextLetterDayDate(nextDate);
          if(nextDate == undefined){
            //Use 1st period as backup
            startingClass = 1;
          }else{
            startingClass = this.letterDay.classesOf(nextDate)[0];
          }
        }
      }
      else{
        startingClass = classes[0];
      }
    }else{
      //Use 1st period as backup
      startingClass = 1;
    }

    //Now that we know our next class, we can order the rest of the todo's
    var classList = [];
    for(var i = 0; i < 7; i++){
      console.log(startingClass);
      var thisClass = this.mySched.get("block", (startingClass-1+i)%7 + 1);
      if(thisClass != undefined){
        classList.push(thisClass);
      }
    }

    //Cut out the completed tasks, if there are any.
    for(var i = 0; i < classList.length; i++){
      for(var j = 0; j < classList[i].tasks.length; j++){
        if(classList[i].tasks[j].completed == true){
          classList[i].tasks.splice(j, 1);
          j--;
        }
      }
      //Sort the tasks in order of due date
      classList[i].tasks.sort((a,b)=> {
        if(!a.date && !b.date){return 0}
        if(!a.date) return 1;
        if(!b.date) return -1;
        let d1 = new Date(a.date.substring(0,4), a.date.substring(5,7), a.date.substring(8,10)).getTime();
        let d2 = new Date(b.date.substring(0,4), b.date.substring(5,7), b.date.substring(8,10)).getTime();
        if(d1==d2) return 0;
        if(d1<d2) return -1;
        return 1;
      });
    }
    this.classes = classList;
  }

  //Opens the configuration modal for a specific todo
  openTodoConfig(clsIndex, taskIndex){
    this.modalCtrl.create({component: TodoConfigPage, componentProps:{clsId:this.classes[clsIndex].time.id, taskIndex}}).then(modal => {
      modal.present();
      modal.onWillDismiss().then(() => {
        this.refresh();
      })
    })
  }

  dateToISO(date){
    //return date.getHours()+":"+(date.getMinutes()<10?"0":"")+date.getMinutes();
    return date.getFullYear()+"-"+
      (date.getMonth()+1<10?"0":"")+(date.getMonth()+1)+"-"+
      (date.getDate()<10?"0":"")+date.getDate()+"T"+
      (date.getHours()<10?"0":"")+date.getHours()+":"+
      (date.getMinutes()<10?"0":"")+date.getMinutes()+":00";
  }

  ISOtoDate(str){
    return new Date(str.substring(0,4), (parseInt(str.substring(5,7))-1), str.substring(8,10), str.substring(11,13), str.substring(14, 16));
  }

  //Fet the color for a task.
  getColor(task){
    let dueDate = new Date(task.date.substring(0,4), (parseInt(task.date.substring(5,7))-1), task.date.substring(8,10));
    const now = new Date();
    if(dueDate.getFullYear() == now.getFullYear() && dueDate.getMonth() == now.getMonth() && dueDate.getDate() == now.getDate()){
      return '#f49842'; //Orange since it is due today
    }

    if(dueDate.getTime() < now.getTime()){
      return '#f44141'; //Red since it was due before today
    }
    if(task.reminder && this.ISOtoDate(task.reminder).getTime() > Date.now()){
      return '#11bbf7' //Blue since a reminder is set
    }
    return '#000' //Black since nothing
  }

  formatDate (str){
    if(!str) return "";
    return str.substring(5, 7)+"/"+str.substring(8, 10);
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
    //Fade out the task (fade due to css animation)
    elem.parentNode.parentNode.style.opacity = "0";
    //Set a timeout to actually remove the event
    this.timeouts[taskIndex+""+clsIndex] = window.setTimeout(() => {
      elem.parentNode.parentNode.style.display = "none";
      this.notifications.scheduleAll();
      this.mySched.save();
    }, 1000);
  }

  //If a task is fading away but we uncheck the box
  readdTask(taskIndex, clsIndex, elem) {
    //Cancel the timeout to remove the event
    if(this.timeouts[taskIndex+""+clsIndex]){
      window.clearTimeout(this.timeouts[taskIndex+""+clsIndex]);
    }
    //Cancel the animation
    elem.parentNode.parentNode.style["transition-duration"] = '0s';
    elem.parentNode.parentNode.style.opacity = 1;
    setTimeout(()=>elem.parentNode.parentNode.style["transition-duration"] = '1s', 5);
  }

  //Delete a task if the name is empty.
  oldTaskUnfocus(val, taskIndex, clsIndex){
    if(val == ""){
      this.classes[clsIndex].tasks.splice(taskIndex, 1);
    }
    this.mySched.save();
  }

  oldClassKeypress(e){
    //If you hit enter
    if(e.keyCode == 13){
      e.target.blur();
      this.mySched.save();
    }
  }

  newClassKeypress(e, clsId){
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
