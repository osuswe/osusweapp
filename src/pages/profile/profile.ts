import { Component } from '@angular/core';
import { NavController, AlertController, App } from 'ionic-angular';
import { Http, Headers } from "@angular/http";
import { Login } from "../login/login";
import 'rxjs';

/*
 Generated class for the Profile page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
    selector: 'page-profile',
    templateUrl: 'profile.html'
})
export class Profile {

    public full_name;
    public first_name;
    public last_name;
    public major;
    public phone;
    public grad_year;
    public username;
    public id;
    public invalidMessage;
    public showInvalid;

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

    private pull_user_info_url = "";

    constructor(public navCtrl: NavController, public alertCtrl: AlertController, private http: Http
        , public app: App) {

        var user = localStorage.getItem('user');
        console.log(user);
        var userObj = JSON.parse(user);
        this.id = userObj.id;
        this.full_name = userObj.fullName;
        this.major = userObj.major;
        this.phone = userObj.phone;
        this.grad_year = userObj.graduationYear;
        this.username = userObj.username;
        var split_name = this.full_name.split(" ");
        this.first_name = split_name[0];
        this.last_name = split_name[1];

    }

    /**
     * Update profile information
     */
    updateUser() {

        if (!this.showInvalid) {
            var headers = new Headers();
            headers.append('Content-Type', 'application/json');

            let profileUpdateUrl = "http://phplaravel-36682-78164-214811.cloudwaysapps.com/admin/update/profile";

            //construct first and last name on user update from full name
            var split_name = this.full_name.split(" ");
            this.first_name = split_name[0];
            this.last_name = split_name[1];

            this.http.post(profileUpdateUrl,
                JSON.stringify({
                    id: this.id,
                    username: this.username,
                    firstName: this.first_name,
                    lastName: this.last_name,
                    phone: this.phone,
                    graduationYear: this.grad_year,
                    major: this.major

                }), { headers: headers })
                .map(res => res.text())
                .subscribe(data => {
                    console.log(data);
                    if (data == "success") {
                        this.showAlert("Profile Updated", "Your profile information has been successfully updated!");
                        localStorage.setItem("user",
                            JSON.stringify({
                                id: this.id,
                                username: this.username,
                                firstName: this.first_name,
                                lastName: this.last_name,
                                phone: this.phone,
                                graduationYear: this.grad_year,
                                major: this.major

                            }));
                    }
                    else if (data == "failure") {
                        this.showAlert("Update Failed", "There has been an update error. Please try again later.");

                    }


                }
                , err => {
                    this.showAlert("Server Error!",
                        "Our server is currently having difficulties. Please try again later!");
                    console.log(err);
                });

        }

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

    ionViewDidLoad() {
        console.log('Hello Profile Page');
    }

    gotoProfile() {
        console.log("going to profile page...");
        this.navCtrl.push(Profile);
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

                    if (this.full_name.length == 0) {
                        this.invalidMessage = "Please enter your full name";
                        this.showInvalid = true;
                    }
                    else if (this.major.length == 0) {
                        this.invalidMessage = "Please enter a major";
                        this.showInvalid = true;
                    }
                    else if (this.grad_year.length == 0) {
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
            this.invalidMessage = "Username length must be greater than 0";
            this.showInvalid = true;

        }


    }


}
