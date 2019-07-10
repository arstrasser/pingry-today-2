import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from '@ionic/angular';


@Component({
  selector: 'app-full-color-picker',
  templateUrl: './full-color-picker.page.html',
  styleUrls: ['./full-color-picker.page.scss'],
})
export class FullColorPickerPage implements OnInit {
  color:string;
  colorPickerWidth:number;
  constructor(public navCtrl: NavController, public navParams: NavParams) {}


  ngOnInit() {
    this.color = this.navParams.get("color");
    this.colorPickerWidth = (document.getElementById("pickerIonContent").clientWidth - 32) *0.9;
  }

  save(){
    document.querySelector('ion-modal-controller').dismiss(this.color);
  }

  close(){
    document.querySelector('ion-modal-controller').dismiss(null);
  }

}
