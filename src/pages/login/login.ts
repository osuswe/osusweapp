import { Component } from '@angular/core';
import { NavController, App } from 'ionic-angular';
import { Signup } from '../signup/signup';
import { Http, Response, Headers } from '@angular/http';
import 'rxjs';
import { AlertController } from 'ionic-angular';
import { Tabs } from "../tabs/tabs";
/*
 Generated class for the Login page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
    selector: 'page-login',
    templateUrl: 'login.html'
})
export class Login {


    public input_username = "";
    public input_password = "";
    public loginResult;
    public showInvalid = false;
    public invalidMessage = "";

    constructor(public navCtrl: NavController, private http: Http, private alertCtrl: AlertController, 
    private app:App) {
        console.log('Hello Login Page');

    }

    ionViewDidLoad() {

    }


    toSignup() {
        this.navCtrl.push(Signup);
    }


    /**
     * Checks if username/password length > 0, dot number is included, # is valid
     * @returns {boolean} passes all validation
     */
    isValid() {
        console.log('checking validity...');
        if (this.input_username.length > 0) {
            if (this.input_password.length > 0) {
                if (this.input_username.indexOf(".") != -1) {
                    var split_username = this.input_username.split(".");
                    if (split_username.length == 2 && !isNaN(parseInt(split_username[1]))) {
                        this.showInvalid = false;
                    }
                    else {
                        this.invalidMessage = "Number in username is not a valid number";
                        this.showInvalid = true;
                    }
                }
                else {
                    this.invalidMessage = "Username must contain . for dot #";
                    this.showInvalid = true;

                }
            }
            else {
                this.invalidMessage = "Password length must be greater than 0";
                this.showInvalid = true;

            }
        }
        else {
            this.invalidMessage = "Username length must be greater than 0";
            this.showInvalid = true;

        }

    }

    login() {
        if (!this.showInvalid) {
            var headers = new Headers();
            headers.append('Content-Type', 'application/json');

            let loginUrl = "http://phplaravel-36682-78164-214811.cloudwaysapps.com/admin/login";

            this.http.post(loginUrl,
                JSON.stringify({
                    username: this.input_username, password: this.input_password
                }), { headers: headers })
                .map(res => res.text())
                .subscribe(data => {
                    this.afterLogin(data);
                    //alert("Success "+data); }
                }
                , err => {
                    this.afterLogin("server_error");
                });

        }

    }

    afterLogin(result) {

        if (result == 'true') {

            localStorage.setItem("user", JSON.stringify({
                username: this.input_username
            }));

            this.app.getRootNav().setRoot(Tabs).then(data => {
                console.log(data);
            }, (error) => {
                console.log("NAV ERROR:");
                console.log(error);
            })
        }

        else if (result == 'server_error') {
            this.showAlert('Server Error', "Our server is currently having difficulties. Please try again later!");

        }

        else if (result == "false") {
            this.showAlert('Login Failed', "The username or password was incorrect. Please try again!");
        }
        console.log(result);

    }

    showAlert(custTitle, custSubtitle) {
        let alert = this.alertCtrl.create({
            title: custTitle,
            subTitle: custSubtitle,
            buttons: ['OK']
        });
        alert.present();
    }

    handleError(error) {
        console.log(error);
        return error.json().message || 'Server error, please try again later';
    }

}
