import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ClassManagePage } from './class-manage';

@NgModule({
  declarations: [
    ClassManagePage,
  ],
  imports: [
    IonicPageModule.forChild(ClassManagePage),
  ],
  exports: [
    ClassManagePage
  ]
})
export class ClassManagePageModule {}
