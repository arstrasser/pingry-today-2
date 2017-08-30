import { Injectable } from '@angular/core';
import { Toast } from '@ionic-native/toast';
import { AlertController } from 'ionic-angular';

@Injectable()
export class MessagesProvider {

  constructor(public toast:Toast, public alertCtrl: AlertController) {}

  hide(){
    return this.toast.hide();
  }

  showError(msg:string){
    this.hide();
    return this.toast.showWithOptions({message:msg, position:"bottom", duration:3000, styling:{backgroundColor:"#F73333"}});
  }

  showSuccess(msg:string){
    this.hide();
    return this.toast.showWithOptions({message:msg, position:"bottom", duration:3000, styling:{backgroundColor:"#53ed53"}});
  }

  showNormal(msg:string){
    this.hide();
    return this.toast.showShortBottom(msg);
  }

  popup(title:string, message:string){
    //TODO: Implement Cordova Dialogs
    let alert = this.alertCtrl.create({
      title,
      message
    });
    alert.present();
    return alert;
  }

  confirm(title:string, message:string, callback?){
    let alert = this.alertCtrl.create({
      title,
      message,
      buttons: [
        {
          text:"No",
          role:"cancel",
          handler: () => {if(callback){callback(false)}}
        },
        {
          text:"Yes",
          handler: () => {if(callback){callback(true)}}
        }
      ]
    })
    alert.present();
    return alert;
  }

}
