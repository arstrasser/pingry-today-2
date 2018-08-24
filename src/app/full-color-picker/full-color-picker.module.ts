import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { ColorPickerModule } from 'ngx-color-picker';
import { IonicModule } from '@ionic/angular';

import { FullColorPickerPage } from './full-color-picker.page';

const routes: Routes = [
  {
    path: '',
    component: FullColorPickerPage
  }
];

@NgModule({
  imports: [
    ColorPickerModule,
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [FullColorPickerPage]
})
export class FullColorPickerPageModule {}
