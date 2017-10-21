import { Component } from '@angular/core';
import { IonicPage, ViewController, NavParams } from 'ionic-angular';

/**
 * Generated class for the FullColorPickerPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-full-color-picker',
  templateUrl: 'full-color-picker.html',
})
export class FullColorPickerPage {
  color:string;
  colorPickerWidth:number;
  constructor(public viewCtrl: ViewController, public navParams: NavParams) {
    this.color = this.navParams.get("color");
  }

  ngOnInit(){
    this.colorPickerWidth = (document.getElementById("pickerIonContent").clientWidth - 32) *0.9;
  }

  save(){
    this.viewCtrl.dismiss(this.color);
  }

  close(){
    this.viewCtrl.dismiss(null);
  }

}
