import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AthleticsPage } from './athletics';

@NgModule({
  declarations: [
    AthleticsPage,
  ],
  imports: [
    IonicPageModule.forChild(AthleticsPage),
  ],
  exports: [
    AthleticsPage
  ]
})
export class AnnouncementsPageModule {}
