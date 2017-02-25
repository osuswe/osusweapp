import { Component } from '@angular/core';
import { NavController, App } from 'ionic-angular';
import { Login } from '../login/login';
import { Profile } from "../profile/profile";
/*
  Generated class for the Home page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class Home {

  constructor(public navCtrl: NavController, public app: App) { }

  ionViewDidLoad() {
    console.log('Hello Home Page');
  }

  logout() {
    this.app.getRootNav().setRoot(Login).then(data => {
      console.log(data);
    }, (error) => {
      console.log(error);
    });
  }

  gotoProfile() {
    console.log("going to profile page...");
    this.navCtrl.push(Profile);
  }


}
