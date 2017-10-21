import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ColorPickerModule } from 'ngx-color-picker';
import { FullColorPickerPage } from './full-color-picker';

@NgModule({
  declarations: [
    FullColorPickerPage,
  ],
  imports: [
    ColorPickerModule,
    IonicPageModule.forChild(FullColorPickerPage),
  ],
  exports: [
    FullColorPickerPage
  ]
})
export class FullColorPickerPageModule {}
