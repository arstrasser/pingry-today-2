import { Injectable } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';

//Service to show toast messages and alerts in a consistent, easy, callable format
@Injectable({
  providedIn: 'root'
})
export class MessagesService {
  constructor(public toast:ToastController, public alertCtrl: AlertController) {}

  async showError(message:string){
    return this.toast.create({message, duration:3000, cssClass:"toast-error"}).then((toast) => toast.present());
  }

  async showSuccess(message:string){
    return this.toast.create({message, duration:3000, cssClass:"toast-success"}).then((toast) => toast.present());
  }

  async showNormal(message:string){
    return this.toast.create({message, duration:3000, cssClass:"toast-normal"}).then((toast) => toast.present());
  }

  async showShort(message:string){
    return this.toast.create({message, duration:500, cssClass:"toast-normal"}).then((toast) => toast.present());
  }

  async popup(header:string, message:string){
    return this.alertCtrl.create({
      header,
      message
    }).then(alert => alert.present())
  }

  async confirm(header:string, message:string, callback?){
    return this.alertCtrl.create({
      header,
      message,
      buttons: [
        {
          text:"Cancel",
          role:"cancel",
          handler: () => {if(callback){callback(false)}}
        },
        {
          text:"Ok",
          handler: () => {if(callback){callback(true)}}
        }
      ]
    }).then(alert => alert.present());
  }
}
