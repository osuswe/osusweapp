import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, App, Platform } from 'ionic-angular';
import { NativeStorage } from "ionic-native";
import { Events } from "../events/events";
import { Headers, Http } from "@angular/http";
import { Home } from "../home/home";
import { LocalNotifications, Vibration } from "ionic-native";
import { Profile } from "../profile/profile";
import { Directory } from "../directory/directory";
import { Info } from "../info/info";
import { Login } from "../login/login";

/*
 Generated class for the Tabs page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
    selector: 'page-tabs',
    templateUrl: 'tabs.html'
})
export class Tabs {

    public tab1Root: any;
    public tab2Root: any;
    public tab4Root: any;
    public tab5Root: any;
    public username;
    public user;
    public events;

    //use this to mark the in app notification for the tab
    public eventsBadgeValue = null;


    constructor(private platform: Platform, private navParams: NavParams, private http: Http, private alertCtrl: AlertController,
        public navCtrl: NavController, private app: App) {

        // this tells the tabs component which Pages
        // should be each tab's root Page
        this.tab1Root = Home;
        this.tab2Root = Events;
        // this.tab3Root = Profile;
        this.tab4Root = Directory;
        this.tab5Root = Info;

        var result = localStorage.getItem('user');
        var userObj = JSON.parse(result);
        this.username = userObj.username;

        console.log(this.username);
        this.pullUserInfo();

//handle pausing/resuming of app
    platform.ready().then(() => {    
        this.platform.pause.subscribe(() => {
            console.log('[INFO] App paused');
        });

        this.platform.resume.subscribe(() => {
            console.log('[INFO] App resumed');
            console.log("updating events in tabs...");
            this.getEvents();
        });
    });

    }


    ionViewDidLoad() {

    }

    ionViewDidEnter() {
        console.log("entering tabs");
        this.getEvents();
    }

    getEvents() {

        var headers = new Headers();
        headers.append('Content-Type', 'application/json');

        let getEventsUrl = "http://phplaravel-36682-78164-214811.cloudwaysapps.com/admin/get/events/all";

        this.http.get(getEventsUrl,
            { headers: headers })
            .map(res => res.json())
            .subscribe(data => {

                //clear events badge
                this.eventsBadgeValue = null;

                for (var i = 0; i < data.length; i++) {
                    var currentEvent = data[i];
                    console.log(currentEvent);
                    var result_array = this.inTime(currentEvent.date, currentEvent.time_range);

                    if (result_array[0] && !result_array[2]) {
                        this.eventsBadgeValue += 1;
                        //add badge attribute to make sure event badge is showed in drop down
                        data[i].badge = true;
                    }
                    else {
                        data[i].badge = false;
                    }

                    data[i].time_until = Math.floor(result_array[1]);
                    data[i].happened = result_array[2];

                    //console.log(data[i].happened);

                }

                //console.log(data);
                localStorage.setItem('events', JSON.stringify({ events: data }));

            }, error => {
                console.log("Server Error  " + error);
                this.showAlert('Server Error', "Our server is currently having difficulties. Please try again later!");
            });
    }

    /**
     * If current time is within 24 hours of the event and if the event is still happening
     * @param eventDate the date of the current event
     * @param eventTime the time of the current event
     * @return resultArray whether or not the event is within 24 hours of the current time and time until event in hours
     */
    inTime(eventDate, eventTime) {
        var twentyFourHours = 86400000;

        var currentTime = new Date();
        currentTime.setTime(currentTime.getTime());
        var eventDateSplit = eventDate.split("-");
        var year = eventDateSplit[0];
        var month = eventDateSplit[1] - 1;//months start at 0 index
        var day = eventDateSplit[2];


        //console.log("Time value: " + this.time);

        var timeSplit = eventTime.split("-");

        var startTime = timeSplit[0];
        var startHours = Number(startTime.match(/^(\d+)/)[1]);
        var startMinutes = Number(startTime.match(/:(\d+)/)[1]);
        var am_pm_split = startTime.split(" ");
        var AMPM = am_pm_split[1];
        //console.log("Start am/pm: " + AMPM);
        if (AMPM.toLowerCase() == "pm" && startHours < 12) startHours = startHours + 12;
        if (AMPM.toLowerCase() == "am" && startHours == 12) startHours = startHours - 12;

        var endTime = timeSplit[1];
        var endHours = Number(endTime.match(/^(\d+)/)[1]);
        var endMinutes = Number(endTime.match(/:(\d+)/)[1]);
        var end_am_pm_split = endTime.split(" ");
        var endAMPM = end_am_pm_split[1];
        //console.log(endAMPM);
        if (endAMPM.toLowerCase() == "pm" && endHours < 12) endHours = endHours + 12;
        if (endAMPM.toLowerCase() == "am" && endHours == 12) endHours = endHours - 12;

        var eventDateObj = new Date(year, month, day, startHours, startMinutes, 0, 0);
        var endEventDateObj = new Date(year, month, day, endHours, endMinutes, 0, 0);

        // console.log("Event Start Time: " + eventDateObj);
        // console.log("Event End Time: " + endEventDateObj);
        // console.log("Current Time: " + currentTime);
        // console.log(eventDateObj.getTime() - currentTime.getTime());

        var result_array = [];

        //check if event is within 24 hours of current time and that the event hasn't ended yet
        var inTime = (eventDateObj.getTime() - currentTime.getTime() <= twentyFourHours
            && currentTime.getTime() <= endEventDateObj.getTime());

        var happened = currentTime.getTime() > endEventDateObj.getTime();

        result_array[0] = inTime;
        //get time until event in hours
        result_array[1] = (eventDateObj.getTime() - currentTime.getTime()) / 3600000;

        result_array[2] = happened;

        return result_array;
    }

    /**
     * Returns user profile info from db given a username
     */
    pullUserInfo() {
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');

        let pullUserInfoUrl = "http://phplaravel-36682-78164-214811.cloudwaysapps.com/admin/get/userProfile";


        this.http.post(pullUserInfoUrl,
            JSON.stringify({
                username: this.username
            }), { headers: headers })
            .map(res => res.json())
            .subscribe(data => {

                localStorage.setItem('user', JSON.stringify({
                    username: data.username,
                    id: data.id,
                    password: data.password,
                    major: data.major,
                    email: data.username + "@osu.edu",
                    fullName: data.firstName + " " + data.lastName,
                    graduationYear: data.graduationYear,
                    phone: data.phone
                }));
            }
            , err => {
                console.log(err);
                this.showAlert('Server Error', "Our server is currently having difficulties. Please try again later!");
            });
    };


    showAlert(custTitle, custSubtitle) {
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

    logout() {
        this.navCtrl.parent.setRoot(Login);

    }


}
