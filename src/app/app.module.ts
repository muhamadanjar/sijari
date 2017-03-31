import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { HomePage, HomePopover } from '../pages/home/home';
import { LoginPage} from '../pages/login/login';
import { PoiPage,PoiPopover} from '../pages/poi/poi';
import { PoiMapPage, PoiMapLocatePage , PinPointMapPage, ModalPoiMap} from '../pages/poi/poiMap';
import { TabPage } from '../pages/tab/tab';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';


import { IonicStorageModule,Storage } from '@ionic/storage';
import { Auth } from '../providers/auth';
import { DataFasilitas } from '../providers/poipandeglang';
import { Map } from '../providers/map';
import { Connect } from '../providers/connect';
import { Geolocation } from '@ionic-native/geolocation';

export function provideStorage() {
 return new Storage();
}
@NgModule({
  declarations: [
    MyApp,
    HomePage, HomePopover,
    LoginPage,
    PoiPage, PoiPopover,
    PoiMapPage, PoiMapLocatePage, PinPointMapPage,ModalPoiMap,

    TabPage,
  ],
  imports: [
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage, HomePopover,
    LoginPage,
    PoiPage, PoiPopover,
    PoiMapPage, PoiMapLocatePage, PinPointMapPage, ModalPoiMap,

    TabPage,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Auth,
    DataFasilitas,
    Geolocation,
    Map,
    Connect,
    { provide: Storage, useFactory: provideStorage },
    { provide: ErrorHandler, useClass: IonicErrorHandler }
  ]
})
export class AppModule {}
