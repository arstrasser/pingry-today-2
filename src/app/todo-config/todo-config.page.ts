import { Component, OnInit } from '@angular/core';
import { NavParams } from '@ionic/angular';

import { MyScheduleService } from '../my-schedule.service';
import { MessagesService } from '../messages.service';
import { NotificationsService } from '../notifications.service';


@Component({
  selector: 'app-todo-config',
  templateUrl: './todo-config.page.html',
  styleUrls: ['./todo-config.page.scss'],
})
export class TodoConfigPage implements OnInit {
  clsIndex:number;
  taskIndex:number;
  cls:any;
  maxDay:string = "";
  minDay:string = "";
  constructor(public navParams: NavParams, public mySched:MyScheduleService, public messages:MessagesService, public notifications:NotificationsService) {
    this.maxDay = (new Date().getFullYear() + 1)+"-08-31";
    this.minDay = (new Date().getFullYear() - 1)+"-08-31";
  }

  ngOnInit() {
    this.clsIndex = this.navParams.get("clsId");
    this.taskIndex = this.navParams.get("taskIndex");
    this.cls = this.mySched.get("block", this.clsIndex);
  }

  reminderEnableChange() {
    if(this.cls.tasks[this.taskIndex].reminder){
      let d = this.dateToISO(new Date(Date.now() + 86400000));
      this.cls.tasks[this.taskIndex].reminder = d;
    }else{
      this.cls.tasks[this.taskIndex].reminder = null;
    }
  }

  dueDateChange(newVal){
    this.cls.tasks[this.taskIndex].date = this.selectorToISO(newVal);
  }

  dateToISO(date){
    return date.getFullYear()+"-"+
      (date.getMonth()+1<10?"0":"")+(date.getMonth()+1)+"-"+
      (date.getDate()<10?"0":"")+date.getDate()+"T"+
      (date.getHours()<10?"0":"")+date.getHours()+":"+
      (date.getMinutes()<10?"0":"")+date.getMinutes()+":00";
  }

  selectorToISO(selection){
    if(!selection.year) return selection;
    return this.dateToISO(new Date(selection.year.value, selection.month.value-1, selection.day.value));
  }

  ISOtoDate(str){
    return new Date(str.substring(0,4), (parseInt(str.substring(5,7))-1), str.substring(8,10), str.substring(11,13), str.substring(14, 16));
  }

  close(){
    this.mySched.save();
    this.notifications.scheduleAll();
    document.querySelector('ion-modal-controller').dismiss();
  }

  reminderChange(newVal){
    if(this.cls.tasks[this.taskIndex].reminder){
      this.cls.tasks[this.taskIndex].reminder = this.selectorToISO(newVal);
      let reminderTime = this.ISOtoDate(this.cls.tasks[this.taskIndex].reminder).getTime();
      const str = this.cls.tasks[this.taskIndex].date;
      //Day after since minutes and seconds round up
      let dueDate = new Date(str.substring(0,4), (parseInt(str.substring(5,7))-1), parseInt(str.substring(8,10))+1);
      if(reminderTime < Date.now()){
        this.messages.popup("Warning", "This reminder is set before now");
      }else if(dueDate.getTime() < reminderTime){
        this.messages.popup("Warning", "This reminder is set after the due date");
      }
    }

  }

  delete(){
    this.messages.confirm("Delete", "Delete this todo item?", res => {
      if(res) {
        this.mySched.get("block", this.clsIndex).tasks.splice(this.taskIndex, this.taskIndex+1);
        this.close();
      }
    })
  }

}
