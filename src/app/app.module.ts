import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import {Home} from '../pages/home/home';
import {Tabs} from '../pages/tabs/tabs';
import {Login} from '../pages/login/login';
import {Signup} from '../pages/signup/signup';
import {Events} from '../pages/events/events';
import {SingleEvent} from '../pages/single-event/single-event';
import {Profile} from "../pages/profile/profile";
import {Directory} from "../pages/directory/directory";
import {SingleMemberPage} from "../pages/single-member-page/single-member-page";
import {Info} from "../pages/info/info";

@NgModule({
  declarations: [
    MyApp,
        Home,
        Tabs,
        Login,
        Signup,
        Events,
        SingleEvent,
        Profile,
        Directory,
        SingleMemberPage,
        Info
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
        Home,
        Tabs,
        Login,
        Signup,
        Events,
        SingleEvent,
        Profile,
        Directory,
        SingleMemberPage,
        Info
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler}]
})
export class AppModule {}
