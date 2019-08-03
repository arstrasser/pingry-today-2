import { Component, OnInit } from '@angular/core';
import { NavParams, ModalController } from '@ionic/angular';


@Component({
  selector: 'app-full-color-picker',
  templateUrl: './full-color-picker.page.html',
  styleUrls: ['./full-color-picker.page.scss'],
})
export class FullColorPickerPage implements OnInit {
  color:string;
  colorPickerWidth:number;
  constructor(public navParams: NavParams, private modalCtrl:ModalController) {}


  ngOnInit() {
    this.color = this.navParams.get("color");
    this.colorPickerWidth = (document.getElementById("pickerIonContent").clientWidth - 32) *0.9;
  }

  save(){
    this.modalCtrl.dismiss(this.color);
  }

  close(){
    this.modalCtrl.dismiss(null);
  }

}
