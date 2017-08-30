import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EditClassPage } from './edit-class';

@NgModule({
  declarations: [
    EditClassPage,
  ],
  imports: [
    IonicPageModule.forChild(EditClassPage),
  ],
  exports: [
    EditClassPage
  ]
})
export class EditClassPageModule {}
