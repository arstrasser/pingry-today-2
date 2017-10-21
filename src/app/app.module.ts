import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { ColorPickerModule } from 'ngx-color-picker';
import { IonicStorageModule } from '@ionic/storage';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { AppVersion } from '@ionic-native/app-version';
import { LocalNotifications } from '@ionic-native/local-notifications';

import { MyApp } from './app.component';
import { AboutPage } from '../pages/about/about';
import { AboutPageModule } from '../pages/about/about.module';
import { AnnouncementsPage } from '../pages/announcements/announcements';
import { AnnouncementsPageModule } from '../pages/announcements/announcements.module';
import { AnnouncementsPopupPage } from '../pages/announcements-popup/announcements-popup';
import { AnnouncementsPopupPageModule } from '../pages/announcements-popup/announcements-popup.module';
import { ArticlePage } from '../pages/article/article';
import { ArticlePageModule } from '../pages/article/article.module';
import { AthleticsPage } from '../pages/athletics/athletics';
import { AthleticsPageModule } from '../pages/athletics/athletics.module';
import { ClassManagePage } from '../pages/class-manage/class-manage';
import { ClassManagePageModule } from '../pages/class-manage/class-manage.module';
import { ClubCalendarPage } from '../pages/club-calendar/club-calendar';
import { ClubCalendarPageModule } from '../pages/club-calendar/club-calendar.module';
import { EditClassPage } from '../pages/edit-class/edit-class';
import { EditClassPageModule } from '../pages/edit-class/edit-class.module';
import { FullColorPickerPage } from '../pages/full-color-picker/full-color-picker';
import { FullColorPickerPageModule } from '../pages/full-color-picker/full-color-picker.module';
import { NewsPage } from '../pages/news/news';
import { NewsPageModule } from '../pages/news/news.module';
import { SchedulePage } from '../pages/schedule/schedule';
import { SchedulePageModule } from '../pages/schedule/schedule.module';
import { SettingsPage } from '../pages/settings/settings';
import { SettingsPageModule } from '../pages/settings/settings.module';
import { TodoPage } from '../pages/todo/todo';
import { TodoPageModule } from '../pages/todo/todo.module';
import { TodoConfigPage } from '../pages/todo-config/todo-config';
import { TodoConfigPageModule } from '../pages/todo-config/todo-config.module';

import { DateFunctionsProvider } from '../providers/date-functions/date-functions';
import { FeedParseProvider } from '../providers/feed-parse/feed-parse';
import { LetterDayProvider } from '../providers/letter-day/letter-day';
import { MessagesProvider } from '../providers/messages/messages';
import { MyScheduleProvider } from '../providers/my-schedule/my-schedule';
import { NotificationsProvider } from '../providers/notifications/notifications';
import { ScheduleProvider } from '../providers/schedule/schedule';
import { SettingsProvider } from '../providers/settings/settings';

@NgModule({
  declarations: [
    MyApp
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    ColorPickerModule,
    AboutPageModule,
    AnnouncementsPageModule,
    AnnouncementsPopupPageModule,
    ArticlePageModule,
    AthleticsPageModule,
    ClassManagePageModule,
    ClubCalendarPageModule,
    EditClassPageModule,
    FullColorPickerPageModule,
    NewsPageModule,
    SettingsPageModule,
    SchedulePageModule,
    TodoPageModule,
    TodoConfigPageModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    AnnouncementsPage,
    AnnouncementsPopupPage,
    ArticlePage,
    AthleticsPage,
    ClassManagePage,
    ClubCalendarPage,
    EditClassPage,
    FullColorPickerPage,
    NewsPage,
    SettingsPage,
    SchedulePage,
    TodoPage,
    TodoConfigPage
  ],
  providers: [
    AppVersion,
    InAppBrowser,
    StatusBar,
    SplashScreen,
    LocalNotifications,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    LetterDayProvider,
    ScheduleProvider,
    MyScheduleProvider,
    DateFunctionsProvider,
    SettingsProvider,
    MessagesProvider,
    FeedParseProvider,
    NotificationsProvider
  ]
})
export class AppModule {}
