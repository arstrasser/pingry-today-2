import { Component, OnInit } from '@angular/core';

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
  constructor(private user:UserService, private messages:MessagesService) { }

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
    document.querySelector('ion-modal-controller').dismiss(null);
  }
}
