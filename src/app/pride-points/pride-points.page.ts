import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner/ngx';
import { MessagesService } from '../messages.service';
import { UserService } from '../user.service';

@Component({
  selector: 'app-pride-points',
  templateUrl: './pride-points.page.html',
  styleUrls: ['./pride-points.page.scss'],
})
export class PridePointsPage implements OnInit {
  points:number = 0;
  pointsLoaded:boolean = false;

  constructor(private qrScanner:QRScanner, private messages:MessagesService, private user:UserService) { }

  ngOnInit() {
  }

  codeScanned(code){
    this.user.submitCode(code, (status)=>{
      if(status.success){
        this.messages.showNormal("Scanned ")
      }
    })
  }

  openScanner(){
    this.qrScanner.prepare().then((status:QRScannerStatus) => {
      if (status.authorized) {
        // start scanning
        let scanSub = this.qrScanner.scan().subscribe((text: string) => {
          console.log('Scanned something', text);
          this.codeScanned(text);
          this.qrScanner.hide(); // hide camera preview
          scanSub.unsubscribe(); // stop scanning
        });
      } else {
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
