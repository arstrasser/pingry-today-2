import { Component, OnInit, NgZone } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner/ngx';
import { MessagesService } from '../messages.service';
import { UserService } from '../user.service';

import { LoginPage } from '../login/login.page';

@Component({
  selector: 'app-pride-points',
  templateUrl: './pride-points.page.html',
  styleUrls: ['./pride-points.page.scss'],
})
export class PridePointsPage implements OnInit {
  points:number = 0;
  pointsLoaded:boolean = false;
  pointsError:boolean = false;
  scanning:boolean = false;
  leaderboard:{total:number,name:string}[];

  constructor(private qrScanner:QRScanner, private messages:MessagesService, private user:UserService,
    private modalCtrl:ModalController, private zone:NgZone) { }

  ngOnInit() {
    console.log(this.user.isLoggedIn());
    console.log(this.user);
    if(this.user.isLoggedIn()){
      this.user.getUserPoints().then((points:number) => {
        this.points = points;
        this.pointsLoaded = true;
      }).catch(() => {
        this.pointsError = true;
      });
      this.user.getPrideLeaderboard().then((leaderboard:{total:number,name:string}[]) => {
        leaderboard.sort((a,b) => b.total-a.total);
        this.leaderboard = leaderboard;
      })
    }else{
      this.messages.confirm("Login", "You must login to use pride points", (res) => {
        if(res){
          this.modalCtrl.create({component:LoginPage}).then(modal => modal.present());
        }
      })
    }
  }

  codeScanned(code){
    this.closeScanner();
    this.user.submitCode(code).then(() => {
      this.messages.showNormal("Code scanned!");
    }).catch((err) => {
      if(err._body == "User already attended this event."){
        this.messages.showError("You've already attended this event!");
      }else if(err._body == "Event not active"){
        this.messages.showError("This event isn't going on right now. Check back later!");
      }else{
        this.messages.showError("There was an error submitting that code.");
      }
    })
  }

  closeScanner(){
    this.zone.run(() => { this.scanning = false;});
    this.qrScanner.destroy();
  }

  openScanner(){
    if(!this.user.isLoggedIn()){
      return this.messages.showError("You have to log in first!");
    }
    this.qrScanner.prepare().then((status:QRScannerStatus) => {
      if (status.authorized) {

        // start scanning
        let scanSub = this.qrScanner.scan().subscribe((text: string) => {
          console.log('Scanned something', text);
          this.zone.run(() => {
            return this.codeScanned(text);
          });
          scanSub.unsubscribe(); // stop scanning
        });
        this.qrScanner.show();
        this.scanning = true;
      } else {
        this.scanning = false;
        if(status.canOpenSettings){
          if(confirm("Would you like to enable QR code scanning? You can allow camera access in your settings.")){
            this.qrScanner.openSettings();
          }
        }else{
          this.messages.popup("QR Scanner", "There was an error opening the QR Scanner...");
        }
      }
    })
  }

}
