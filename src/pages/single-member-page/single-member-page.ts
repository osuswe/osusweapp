import { Component } from '@angular/core';
import {NavController, NavParams, App} from 'ionic-angular';
import {Login} from "../login/login";
import {Profile} from "../profile/profile";

/*
  Generated class for the SingleMemberPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-single-member-page',
  templateUrl: 'single-member-page.html'
})
export class SingleMemberPage {

  public member;

  constructor(public navCtrl: NavController, public navParams:NavParams, public app:App) {
    this.member=navParams.get("member");
    console.log(this.member);
  }

  ionViewDidLoad() {
    console.log('Hello SingleMemberPage Page');
  }

  logout() {
    this.app.getRootNav().setRoot(Login).then(data => {
      console.log(data);
    }, (error) => {
      console.log(error);
    });
  }

  gotoProfile(){
    console.log("going to profile page...");
    this.navCtrl.push(Profile);
  }
}
