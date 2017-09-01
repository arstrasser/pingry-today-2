import { Injectable } from '@angular/core';
import { AlertController, ToastController } from 'ionic-angular';

@Injectable()
export class MessagesProvider {

  constructor(public toast:ToastController, public alertCtrl: AlertController) {}


  showError(message:string){
    return this.toast.create({message, duration:3000, cssClass:"toast-error"}).present();
  }

  showSuccess(message:string){
    return this.toast.create({message, duration:3000, cssClass:"toast-success"}).present();
  }

  showNormal(message:string){
    return this.toast.create({message, duration:3000}).present();
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
