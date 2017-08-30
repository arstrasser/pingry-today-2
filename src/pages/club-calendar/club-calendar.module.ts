import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ClubCalendarPage } from './club-calendar';

@NgModule({
  declarations: [
    ClubCalendarPage,
  ],
  imports: [
    IonicPageModule.forChild(ClubCalendarPage),
  ],
  exports: [
    ClubCalendarPage
  ]
})
export class AnnouncementsPageModule {}
