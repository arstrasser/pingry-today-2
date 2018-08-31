import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'schedule', pathMatch: 'full' },
  { path: 'about', loadChildren: './about/about.module#AboutPageModule' },
  { path: 'announcements', loadChildren: './announcements/announcements.module#AnnouncementsPageModule' },
  { path: 'announcementsPopup', loadChildren: './announcements-popup/announcements-popup.module#AnnouncementsPopupPageModule' },
  { path: 'article', loadChildren: './article/article.module#ArticlePageModule' },
  { path: 'athletics', loadChildren: './athletics/athletics.module#AthleticsPageModule' },
  { path: 'classManage', loadChildren: './class-manage/class-manage.module#ClassManagePageModule' },
  //{ path: 'ClubCalendar', loadChildren: './club-calendar/club-calendar.module#ClubCalendarPageModule' },
  { path: 'editClass', loadChildren: './edit-class/edit-class.module#EditClassPageModule' },
  { path: 'fullColorPicker', loadChildren: './full-color-picker/full-color-picker.module#FullColorPickerPageModule' },
  { path: 'news', loadChildren: './news/news.module#NewsPageModule' },
  { path: 'schedule', loadChildren: './schedule/schedule.module#SchedulePageModule' },
  { path: 'settings', loadChildren: './settings/settings.module#SettingsPageModule' },
  { path: 'todo', loadChildren: './todo/todo.module#TodoPageModule' },
  { path: 'todoConfig', loadChildren: './todo-config/todo-config.module#TodoConfigPageModule' },
  { path: 'pridePoints', loadChildren: './pride-points/pride-points.module#PridePointsPageModule' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
