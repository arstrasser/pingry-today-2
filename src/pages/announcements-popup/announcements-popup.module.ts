import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AnnouncementsPopupPage } from './announcements-popup';

@NgModule({
  declarations: [
    AnnouncementsPopupPage,
  ],
  imports: [
    IonicPageModule.forChild(AnnouncementsPopupPage),
  ],
  exports: [
    AnnouncementsPopupPage
  ]
})
export class AnnouncementsPopupPageModule {}
