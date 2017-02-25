import { Component } from '@angular/core';
import {NavController, AlertController, App} from 'ionic-angular';
import { Headers, Http } from "@angular/http";
import { SingleMemberPage } from "../single-member-page/single-member-page";
import { CallNumber, SocialSharing } from 'ionic-native';
import {Login} from "../login/login";
import {Profile} from "../profile/profile";


/*
 Generated class for the Directory page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
    selector: 'page-directory',
    templateUrl: 'directory.html'
})
export class Directory {

    public members;

    constructor(public navCtrl: NavController, public alertCtrl: AlertController,
        public http: Http, public app:App) {

    }

    ionViewDidLoad() {
        console.log('Hello Directory Page');
    }

    //call methods every time entering the view
    ionViewDidEnter(){
        console.log("entered directory");
        this.getMembers();
    }

    /**
     * Sets this.members to all members in org from database
     */
    getMembers() {
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');

        let getUsersUrl = "http://phplaravel-36682-78164-214811.cloudwaysapps.com/admin/get/users";

        this.http.get(getUsersUrl,
            { headers: headers })
            .map(res => res.json())
            .subscribe(data => {
                console.log(data);
                this.members = data;

                for (var i = 0; i < this.members.length; i++) {
                    this.members[i].fullName = this.members[i].firstName + " " + this.members[i].lastName;
                }

                localStorage.setItem('members', JSON.stringify({ members: data }))
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

    sendMail(username) {
        // Check if sharing via email is supported
        SocialSharing.canShareViaEmail().then(() => {
            // Sharing via email is possible
            // Share via email
            var email=username+'@osu.edu';
            SocialSharing.shareViaEmail('', '', [email]).then(() => {
                // Success!
            }).catch(() => {
                // Error!
                alert("Email failure! Try again later!");
            });
        }).catch(() => {
            // Sharing via email is not possible
            alert("Email feature not supported!");
        });


    }

    call(phone_number) {

        CallNumber.callNumber(phone_number, true)
            .then(() => console.log('Launched dialer!'))
            .catch(() => console.log('Error launching dialer'));
    }

    /**
     * Navigate to single member page with profile info
     */
    toSingleMemberPage(member) {
        this.navCtrl.push(SingleMemberPage, {
            member: member
        })
    }

    getItems(ev: any) {

        //reinitalizing members array from static data; don't use post request because filtering is faster than post
        //request so filter will look like it failed by loading data after the filter operation
        var membersObj = JSON.parse(localStorage.getItem('members'));
        this.members = membersObj.members;

        // set val to the value of the searchbar
        let val = ev.target.value;

        // if the value is an empty string don't filter the items
        if (val && val.trim() != '') {
            this.members = this.members.filter((item) => {
                return (item.fullName.toLowerCase().indexOf(val.toLowerCase()) > -1);
            })
        }
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
