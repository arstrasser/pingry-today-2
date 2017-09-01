import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { IonicStorageModule } from '@ionic/storage';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { AppVersion } from '@ionic-native/app-version';
import { LocalNotifications } from '@ionic-native/local-notifications';

import { MyApp } from './app.component';
import { AboutPage } from '../pages/about/about';
import { AnnouncementsPage } from '../pages/announcements/announcements';
import { AnnouncementsPopupPage } from '../pages/announcements-popup/announcements-popup';
import { ArticlePage } from '../pages/article/article';
import { AthleticsPage } from '../pages/athletics/athletics';
import { ClassManagePage } from '../pages/class-manage/class-manage';
import { ClubCalendarPage } from '../pages/club-calendar/club-calendar';
import { EditClassPage } from '../pages/edit-class/edit-class';
import { NewsPage } from '../pages/news/news';
import { SchedulePage } from '../pages/schedule/schedule';
import { SettingsPage } from '../pages/settings/settings';
import { TodoPage } from '../pages/todo/todo';
import { TodoConfigPage } from '../pages/todo-config/todo-config';

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
    MyApp,
    AboutPage,
    AnnouncementsPage,
    AnnouncementsPopupPage,
    ArticlePage,
    AthleticsPage,
    ClassManagePage,
    ClubCalendarPage,
    EditClassPage,
    NewsPage,
    SettingsPage,
    SchedulePage,
    TodoPage,
    TodoConfigPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot()
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
