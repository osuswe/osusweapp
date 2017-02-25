import { Component } from '@angular/core';
import { Platform, AlertController } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';
import { Http, Response, Headers } from '@angular/http';
import 'rxjs';
import { Tabs} from '../pages/tabs/tabs';
import { Login} from '../pages/login/login';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  private rootPage: any;

  constructor(platform: Platform, private http:Http, private alertCtrl:AlertController) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      Splashscreen.hide();

            /**
             * One signal setup
             */

            var notificationOpenedCallback = function (jsonData) {
                console.log('notificationOpenedCallback: ' + JSON.stringify(jsonData));
            };

            window["plugins"].OneSignal
                .startInit("a263afad-afe2-471e-b0da-a9d0467b9cb3", "115680124833")
                .handleNotificationOpened(notificationOpenedCallback)
                .endInit();
           

    });
  }

      /**
     * If there is a user object in local storage already log them into the homepage
     * otherwise just have them go to the login screen
     */
    ngOnInit() {

        //run http request to validate that the user still has an online record along with a local record for logging in

        var data = localStorage.getItem("user");
        if (data != null) {
            var userObj = JSON.parse(data);
            console.log(userObj);

            this.validateHasRecord(userObj.username, userObj.password);

        }
        else{
            this.rootPage = Login;
        }
    }

    autoLogin(result){
        console.log("Auto login result..." + result);
        if(result == "true"){
            this.rootPage = Tabs;
        }
        else{
            //clear data from old user info
            localStorage.clear();
            this.rootPage = Login;
        }
    }

        validateHasRecord(localUsername, localPassword) {
            var headers = new Headers();
            headers.append('Content-Type', 'application/json');

            let loginUrl = "http://phplaravel-36682-78164-214811.cloudwaysapps.com/admin/login";

            this.http.post(loginUrl,
                JSON.stringify({
                    username: localUsername,
                    password: localPassword
                }), { headers: headers })
                .map(res => res.text())
                .subscribe(data => {
                    this.autoLogin(data);
                }
                , err => {
                  this.showAlert('Server Error', "Our server is currently having difficulties. Please try again later!");
                  this.rootPage = Login;
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
}
