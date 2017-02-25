import { Component } from '@angular/core';
import { NavController, App, AlertController } from 'ionic-angular';
import { Http, Response, Headers } from '@angular/http';
import 'rxjs/Rx'; //for observable and mapping for http requests
import { Login } from "../login/login";
import { Tabs } from "../tabs/tabs";
/*
  Generated class for the Signup page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
    selector: 'page-signup',
    templateUrl: 'signup.html'
})
export class Signup {

    public username = "";
    public firstName = "";
    public password = "osu-swe";
    public lastName = "";
    public major = "";
    public graduationYear = "";
    public phone = "";
    public invalidMessage = "Please enter your Lastname.#";
    public showInvalid = true;
    public majors = [
        'Aeronautical and Astronautical Engineering',
        'Architecture',
        'Aviation',
        'Biomedical Engineering',
        'Chemical Engineering',
        'Civil Engineering',
        'Computer Science and Engineering',
        'Electrical and Computer Engineering',
        'Engineering Physics',
        'Environmental Engineering',
        'Faculty/staff',
        'Food, Agricultural and Biological Engineering',
        'Industrial and Systems Engineering',
        'Materials Science and Engineering',
        'Mechanical Engineering',
        'Non-Engineering',
        'Undecided Engineering',
        'Welding Engineering'
    ];


    constructor(public navCtrl: NavController, private http: Http, private app: App,
        private alertCtrl: AlertController) { }

    ionViewDidLoad() {
        console.log('Hello Signup Page');
    }

    /**
 * Checks if username/password length > 0, dot number is included, # is valid
 * @returns {boolean} passes all validation
 */
    isValid() {
        console.log('checking validity...');

        if (this.username.length > 0) {
            if (this.username.indexOf(".") != -1) {
                var split_username = this.username.split(".");
                if (split_username.length == 2 && !isNaN(parseInt(split_username[1]))) {
                    this.showInvalid = false;

                    //check if rest of fields are valid

                    if (this.firstName.length == 0) {
                        this.invalidMessage = "Please enter your firstname";
                        this.showInvalid = true;
                    }
                    else if (this.lastName.length == 0) {
                        this.invalidMessage = "Please enter your last name";
                        this.showInvalid = true;
                    }
                    else if (this.major.length == 0) {
                        this.invalidMessage = "Please enter a major";
                        this.showInvalid = true;

                    }
                    else if (this.graduationYear.length == 0) {
                        this.invalidMessage = "Please enter your graduation year";
                        this.showInvalid = true;
                    }
                    //phone number is optional
                    else if ((this.phone.length < 10 && this.phone.length > 0) || this.phone.length > 11) {
                        this.invalidMessage = "Enter a phone number between 10 and 11 numbers";
                        this.showInvalid = true;
                    }
                    else if(isNaN(parseInt(this.phone)) && this.phone.length > 0){
                        this.invalidMessage = "Enter a phone number that only includes numbers";
                        this.showInvalid = true;
                    }

                }
                else {
                    this.invalidMessage = "Number in username is not a valid";
                    this.showInvalid = true;

                }
            }
            else {
                this.invalidMessage = "Username must contain . for dot #";
                this.showInvalid = true;

            }
        }


        else {
            this.invalidMessage = "Username length must be greater than 0";
            this.showInvalid = true;

        }


    }

    logout() {
        this.navCtrl.setRoot(Login);
    }

    showBadAlert(custTitle, custSubtitle) {
        let alert = this.alertCtrl.create({
            title: custTitle,
            subTitle: custSubtitle,
            buttons: [{
                text: 'Ok',
                handler: data => {
                    console.log('Cancel clicked');
                    this.logout();
                }
            }
            ],

        });
        alert.present();
    }

    showGoodAlert(custTitle, custSubtitle) {
        let alert = this.alertCtrl.create({
            title: custTitle,
            subTitle: custSubtitle,
            buttons: [{
                text: 'Ok',
                handler: data => {
                    console.log('Cancel clicked');
                }
            }
            ],

        });
        alert.present();
    }


    join() {
        if (!this.showInvalid) {

            var headers = new Headers();
            headers.append('Content-Type', 'application/json');

            let joinUrl = "http://phplaravel-36682-78164-214811.cloudwaysapps.com/admin/signup";

            this.http.post(joinUrl,
                JSON.stringify({
                    username: this.username, firstName: this.firstName, lastName: this.lastName,
                    major: this.major, graduationYear: this.graduationYear, phone: this.phone,
                    password: this.password
                }), { headers: headers })
                .subscribe(signupResult => {
                    console.log("Success: " + signupResult);
                    this.showGoodAlert('Success', 'Welcome to the SWE App! Click to Proceed');
                    //TODO add a feature to auto login on signup with navparams passing the info just signed up with

                    localStorage.setItem("user", JSON.stringify({
                        username: this.username
                    }));

                    this.app.getRootNav().push(Tabs);
                }, error => {
                    console.log("Error:  " + error);
                    //alert('Error' + error);
                    this.showBadAlert('Error!', 'Signup Failed, please try again later!');
                });

        }
    }

}
