import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'Schedule', pathMatch: 'full' },
  { path: 'about', loadChildren: './about/about.module#AboutPageModule' },
  { path: 'announcements', loadChildren: './announcements/announcements.module#AnnouncementsPageModule' },
  { path: 'AnnouncementsPopup', loadChildren: './announcements-popup/announcements-popup.module#AnnouncementsPopupPageModule' },
  { path: 'Article', loadChildren: './article/article.module#ArticlePageModule' },
  { path: 'Athletics', loadChildren: './athletics/athletics.module#AthleticsPageModule' },
  { path: 'ClassManage', loadChildren: './class-manage/class-manage.module#ClassManagePageModule' },
  //{ path: 'ClubCalendar', loadChildren: './club-calendar/club-calendar.module#ClubCalendarPageModule' },
  { path: 'EditClass', loadChildren: './edit-class/edit-class.module#EditClassPageModule' },
  { path: 'FullColorPicker', loadChildren: './full-color-picker/full-color-picker.module#FullColorPickerPageModule' },
  { path: 'news', loadChildren: './news/news.module#NewsPageModule' },
  { path: 'Schedule', loadChildren: './schedule/schedule.module#SchedulePageModule' },
  { path: 'Settings', loadChildren: './settings/settings.module#SettingsPageModule' },
  { path: 'Todo', loadChildren: './todo/todo.module#TodoPageModule' },
  { path: 'TodoConfig', loadChildren: './todo-config/todo-config.module#TodoConfigPageModule' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
