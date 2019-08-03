
//This page is for logging into the Pingry API user database.
//Users in the Pingry API is an unfinished feature and is unmanaged.
//This was meant to be a login for pride points.
//Please thoroughly test this feature on the Pingry API before implementation.



import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { UserService } from '../user.service';
import { MessagesService } from '../messages.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  username:string = "";
  password:string = "";
  constructor(private user:UserService, private messages:MessagesService, private modalCtrl:ModalController) { }

  ngOnInit() {}

  login(){
    if(this.username.length <2) {
      this.messages.showError("Invalid Username");
      return;
    }else if(this.password.length < 3){
      this.messages.showError("Invalid Password");
      return
    }
    this.user.login(this.username, this.password).then(() => {
      this.messages.showSuccess("Logged in!");
      this.close();
    }).catch((err) => {
      if(err.status == 404){
        this.messages.showError("Invalid Username or Password");
      }else{
        this.messages.showError("Error logging in...");
      }
      console.log(err);
    })
  }

  close(){
    this.modalCtrl.dismiss(null);
  }
}
