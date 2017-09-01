import { Component } from '@angular/core';
import { IonicPage, ViewController, NavParams } from 'ionic-angular';

import { MyScheduleProvider } from '../../providers/my-schedule/my-schedule';
import { MessagesProvider } from '../../providers/messages/messages';
import { NotificationsProvider } from '../../providers/notifications/notifications';

/**
 * Generated class for the TodoConfigPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-todo-config',
  templateUrl: 'todo-config.html',
})
export class TodoConfigPage {
  clsIndex:number;
  taskIndex:number;
  cls:any;
  maxDay:string = "";
  minDay:string = "";
  constructor(public viewCtrl: ViewController, public navParams: NavParams, public mySched:MyScheduleProvider, public messages:MessagesProvider, public notifications:NotificationsProvider) {
    this.maxDay = (new Date().getFullYear() + 1)+"-08-31";
    this.minDay = (new Date().getFullYear() - 1)+"-08-31";
    this.clsIndex = this.navParams.get("clsId");
    this.taskIndex = this.navParams.get("taskIndex");
    this.cls = this.mySched.get("block", this.clsIndex);
  }

  reminderEnableChange() {
    if(this.cls.tasks[this.taskIndex].reminder){
      this.cls.tasks[this.taskIndex].reminder = this.dateToISO(new Date());
    }else{
      this.cls.tasks[this.taskIndex].reminder = null;
    }
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

  close(){
    this.mySched.save();
    this.notifications.scheduleAll();
    this.viewCtrl.dismiss();
  }

  reminderChange(){
    if(this.cls.tasks[this.taskIndex].reminder){
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
        this.viewCtrl.dismiss();
      }
    })
  }

}
