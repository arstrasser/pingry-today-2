import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, RouteReuseStrategy, Routes } from '@angular/router';
import { HttpModule } from '@angular/http';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { IonicStorageModule } from '@ionic/storage';

import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { FCM } from '@ionic-native/fcm/ngx';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { QRScanner } from '@ionic-native/qr-scanner/ngx'

import { AnnouncementsPopupPage } from './announcements-popup/announcements-popup.page';
import { AnnouncementsPopupPageModule } from './announcements-popup/announcements-popup.module';
import { TodoConfigPage } from './todo-config/todo-config.page';
import { TodoConfigPageModule } from './todo-config/todo-config.module';
import { EditClassPage } from './edit-class/edit-class.page';
import { EditClassPageModule } from './edit-class/edit-class.module';
import { FullColorPickerPage } from './full-color-picker/full-color-picker.page';
import { FullColorPickerPageModule } from './full-color-picker/full-color-picker.module';
import { ArticlePage } from './article/article.page';
import { ArticlePageModule } from './article/article.module';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [
    AnnouncementsPopupPage,
    TodoConfigPage,
    EditClassPage,
    FullColorPickerPage,
    ArticlePage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    IonicStorageModule.forRoot(),
    HttpModule,
    AnnouncementsPopupPageModule,
    TodoConfigPageModule,
    EditClassPageModule,
    FullColorPickerPageModule,
    ArticlePageModule
  ],
  providers: [
    StatusBar,
    SplashScreen,
    InAppBrowser,
    FCM,
    AppVersion,
    LocalNotifications,
    QRScanner,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
