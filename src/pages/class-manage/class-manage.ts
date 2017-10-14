import { Component } from '@angular/core';
import { IonicPage, ModalController } from 'ionic-angular';

import { MyScheduleProvider } from '../../providers/my-schedule/my-schedule';

import { EditClassPage } from '../edit-class/edit-class';


/**
 * Generated class for the AboutPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-class-manage',
  templateUrl: 'class-manage.html',
})
export class ClassManagePage {
  myClasses:Array<any> = [];
  myFlexes:Array<any> = [];
  myCPs:Array<any> = [];
  constructor(public mySched:MyScheduleProvider, public modalCtrl: ModalController) {
     this.myClasses = this.mySched.getAll().block;
     this.myClasses.sort((a,b) => {return a.time.id - b.time.id});
     this.myFlexes = this.mySched.getAll().flex;
     this.myCPs = this.mySched.getAll().CP;
  }

  addClass(){
    let modal = this.modalCtrl.create(EditClassPage, {});
    modal.present();
    this.myClasses.sort((a,b) => {return a.time.id - b.time.id});
  }

  editClass(clsType:string, clsId:number){
    let modal = this.modalCtrl.create(EditClassPage, {clsType, clsId});
    modal.present();
    this.myClasses.sort((a,b) => {return a.time.id - b.time.id});
  }
}
