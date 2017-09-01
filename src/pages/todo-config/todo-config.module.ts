import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TodoConfigPage } from './todo-config';

@NgModule({
  declarations: [
    TodoConfigPage,
  ],
  imports: [
    IonicPageModule.forChild(TodoConfigPage),
  ],
  exports: [
    TodoConfigPage
  ]
})
export class TodoConfigPageModule {}
