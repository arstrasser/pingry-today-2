import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { MyScheduleService } from '../my-schedule.service';
import { EditClassPage } from '../edit-class/edit-class.page';


@Component({
  selector: 'app-class-manage',
  templateUrl: './class-manage.page.html',
  styleUrls: ['./class-manage.page.scss'],
})
export class ClassManagePage implements OnInit {
  myClasses:Array<any> = [];
  myFlexes:Array<any> = [];
  myCPs:Array<any> = [];
  constructor(public mySched:MyScheduleService, public modalCtrl: ModalController) {}

  ngOnInit() {
    //Get all the classes
    this.myClasses = this.mySched.getAll().block;
    //Sort classes by block to put them in order
    this.myClasses.sort((a,b) => {return a.time.id - b.time.id});
    this.myFlexes = this.mySched.getAll().flex;
    this.myCPs = this.mySched.getAll().CP;
  }

  addClass(){
    this.modalCtrl.create({component:EditClassPage}).then(modal => {
      modal.present();
      //Resort when done
      modal.onDidDismiss().then(()=>this.myClasses.sort((a,b) => {return a.time.id - b.time.id}));
    });
  }

  editClass(clsType:string, clsId:number){
    this.modalCtrl.create({component: EditClassPage, componentProps:{clsType, clsId}}).then(modal => {
      modal.present();
      //Resort when done
      modal.onDidDismiss().then(()=>this.myClasses.sort((a,b) => {return a.time.id - b.time.id}));
    });
  }
}
