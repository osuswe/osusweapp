import { Component } from '@angular/core';
import {NavController, NavParams, AlertController, App} from 'ionic-angular';
import { Http, Headers } from "@angular/http";
import { NativeStorage } from "ionic-native";
import 'rxjs';
import {Login} from "../login/login";
import {Profile} from "../profile/profile";
/*
 Generated class for the SingleEvent page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
    selector: 'page-single-event',
    templateUrl: 'single-event.html'
})
export class SingleEvent {

    public id;
    public title;
    public date;
    public time;
    public location;
    public description;
    public code_entered = "";
    private attendanceRecordUrl = "http://phplaravel-36682-78164-214811.cloudwaysapps.com/admin/add/attendanceRecord";
    private hasAttendedEventUrl = "http://phplaravel-36682-78164-214811.cloudwaysapps.com/admin/get/hasAttended";
    private event_code;
    public show_invalid = false;
    public attended = false;
    public inTime = false;


    constructor(private navCtrl: NavController, private navParams: NavParams,
        private alertCtrl: AlertController, private http: Http, private app:App) {
        this.title = navParams.get('title');
        this.id = navParams.get('id');
        //format date to mm/dd/yyyy
        //[0]->year, [1]->month, [2]->day
        var date_array = navParams.get('date').split("-");
        console.log(date_array);

        this.date = date_array[1]+"/"+date_array[2]+"/"+date_array[0];
        this.time = navParams.get('time');
        this.location = navParams.get('location');
        this.description = navParams.get('description');
        this.event_code = navParams.get('event_code');

        //check if user has attended event already
        var data = localStorage.getItem('user');

        //parse json string
        var userObj = JSON.parse(data);
        console.log(data);

        this.hasAttended(userObj.id, this.id);
        this.timeCheck();



    }

    ionViewDidLoad() {
        console.log('Hello SingleEvent Page');
    }

    /**
     * If current time is within 20 min of the event open the event code box
     * close the box if it is 30 min into the event
     */
    timeCheck() {
        var currentTime = new Date();
        currentTime.setTime(currentTime.getTime());
        var eventDateSplit = this.date.split("/");
        var month = eventDateSplit[0]-1;//months start at 0 index
        var day = eventDateSplit[1];
        var year = eventDateSplit[2];

        //console.log("Time value: " + this.time);

        var timeSplit = this.time.split("-");

        var startTime = timeSplit[0];
        var startHours = Number(startTime.match(/^(\d+)/)[1]);
        var startMinutes = Number(startTime.match(/:(\d+)/)[1]);
        var am_pm_split = startTime.split(" ");
        var AMPM = am_pm_split[1];
        console.log("Start am/pm: " + AMPM);
        if (AMPM.toLowerCase() == "pm" && startHours < 12) startHours = startHours + 12;
        if (AMPM.toLowerCase() == "am" && startHours == 12) startHours = startHours - 12;

        var endTime = timeSplit[1];
        var endHours = Number(endTime.match(/^(\d+)/)[1]);
        var endMinutes = Number(endTime.match(/:(\d+)/)[1]);
        var end_am_pm_split = endTime.split(" ");
        var endAMPM = end_am_pm_split[1];
        console.log(endAMPM);
        if (endAMPM.toLowerCase() == "pm" && endHours < 12) endHours = endHours + 12;
        if (endAMPM.toLowerCase() == "am" && endHours == 12) endHours = endHours - 12;

        var eventDateObj = new Date(year, month, day, startHours, startMinutes, 0, 0);
        var endEventDateObj = new Date(year, month, day, endHours, endMinutes, 0, 0);

        console.log("Event Start Time: " +eventDateObj);
        console.log("Event End Time: " +endEventDateObj);
        console.log("Current Time: "+currentTime);
        console.log(eventDateObj.getTime() - currentTime.getTime());
        //check if event is within 20 min of current time and within 30 after the event has started
        if (eventDateObj.getTime() - currentTime.getTime() <= 1200000 && currentTime.getTime() <= endEventDateObj.getTime()) {
            this.inTime = true;
        }
        else {
            this.inTime = false;
        }

    }

    /**
     * Check if user has already said they have attended the event
     * @param userId
     * @param eventId
     */
    hasAttended(userId, eventId) {
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');

        this.http.post(this.hasAttendedEventUrl,
            JSON.stringify({
                user_id: userId,
                event_id: this.id
            }), { headers: headers })
            .map(res => res.text())
            .subscribe(data => {
                console.log("Has Attended this event: " + data);
                if (data == "true") {
                    console.log("t");
                    this.attended = true;
                }
                else if (data == "false") {
                    console.log("f");
                    this.attended = false;
                }
            }
            , err => {
                alert(err);
                this.showAlert("Server Error!", "Our server is currently having difficulties. Please try again later!");

            });


    }

    /**
     * stores attendance record in database
     * @param userId
     * @param eventId
     */
    addAttendanceRecord(userId, eventId) {
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');

        this.http.post(this.attendanceRecordUrl,
            JSON.stringify({
                user_id: userId,
                event_id: eventId
            }), { headers: headers })
            .map(res => res.text())
            .subscribe(data => {
                this.showAlert("Attendance Approved", "Thank you for coming to this event. Your attendance has been recorded.")
                this.navCtrl.pop();
            }
            , err => {
                alert(err);
                this.showAlert("Server Error!", "Our server is currently having difficulties. Please try again later!");

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

    /**
     * Process the event code submission;
     * if it is in the right format, then check and see if it
     * matches the event code from the database. If it matches
     * then make the post request for attendance and gray out the box
     *
     * The event code box should only show if the user hasn't successfully
     * entered the code once before
     */
    submit_code() {
        console.log("code submitted: " + this.code_entered);
        //validate code entered
        if (this.code_entered.length == 4) {
            if (!isNaN(parseInt(this.code_entered))) {
                //add attendance record if the event code input matches the event code from the db
                if (this.code_entered == this.event_code) {
                    this.show_invalid = false;
                    var data = localStorage.getItem('user');

                    //parse json string
                    var userObj = JSON.parse(data);
                    console.log(data);
                    this.addAttendanceRecord(userObj.id, this.id)
                }
                else {
                    this.show_invalid = true;
                }
            }
            else {
                this.show_invalid = true;
            }
        }
        else {
            this.show_invalid = true;
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
