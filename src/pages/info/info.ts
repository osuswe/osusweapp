
import {Component} from '@angular/core';
import {NavController, AlertController, App} from 'ionic-angular';
import {Http, Headers} from '@angular/http';
import {Login} from "../login/login";
import {Profile} from "../profile/profile";

/*
 Generated class for the Info page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
    selector: 'page-info',
    templateUrl: 'info.html'
})
export class Info {

    public links;

    constructor(public navCtrl: NavController, public alertCtrl: AlertController, public http:Http,
    public app:App) {
      this.getLinks();
    }

    ionViewDidLoad() {
        console.log('Hello Info Page');
    }


    getLinks() {
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');

        let linksUrl = "http://phplaravel-36682-78164-214811.cloudwaysapps.com/admin/get/links";

        this.http.get(linksUrl, {headers: headers})
            .map(res => res.json())
            .subscribe(data => {
                    console.log(data);
                    this.links = data;
                }
                , err => {
                    this.showAlert('Server Error', "Our server is currently having difficulties. Please try again later!");
                });
    }

    showAlert(custTitle, custSubtitle) {
        let alert = this.alertCtrl.create({
            title: custTitle,
            subTitle: custSubtitle,
            buttons: ['OK']
        });
        alert.present();
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
