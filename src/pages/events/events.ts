import { Component, ViewChild } from '@angular/core';
import { NavController, App, Nav, AlertController, Platform } from 'ionic-angular';
import { NativeStorage } from "ionic-native";
import { Http, Headers } from "@angular/http";
import 'rxjs/Rx';
import { SingleEvent } from "../single-event/single-event";
import { Login } from "../login/login"; //for observable and mapping for http requests
import { Tabs } from "../tabs/tabs";
import { Profile } from "../profile/profile";
/*
  Generated class for the Events page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
    selector: 'page-events',
    templateUrl: 'events.html'
})
export class Events {

    public tabsNavCtrl;
    public events;
    public selectedDate;
    public currentYear;
    public janEvents = [];
    public febEvents = [];
    public marchEvents = [];
    public aprilEvents = [];
    public mayEvents = [];
    public juneEvents = [];
    public julyEvents = [];
    public augEvents = [];
    public septEvents = [];
    public octEvents = [];
    public novEvents = [];
    public decEvents = [];
    public display = '';//tracking current month events to display
    //@ViewChild(Nav) nav: Nav;

    /*
    Badge event count values for months with events in the next 24 hours
     */
    public janCount = null;
    public febCount = null;
    public marchCount = null;
    public aprilCount = null;
    public mayCount = null;
    public juneCount = null;
    public julyCount = null;
    public augCount = null;
    public septCount = null;
    public octCount = null;
    public novCount = null;
    public decCount = null;

    private eventBadgeValue;


    constructor(private platform: Platform, private app: App, private navCtrl: NavController, private http: Http, private alertCtrl: AlertController) {
        var date = new Date();
        this.currentYear = date.getFullYear();
        this.selectedDate = date.getFullYear(); //init default year to current year
        console.log(this.currentYear);



        //handle pausing/resuming of app
    platform.ready().then(() => {    
        this.platform.pause.subscribe(() => {
            console.log('[INFO] App paused');
        });

        this.platform.resume.subscribe(() => {
            console.log('[INFO] App resumed');
            console.log("updating events in events page...");
            this.doRefresh(null);
        });
    });

    }

    //refresh events
    doRefresh(event) {
        this.getEvents(event);
    }

    ionViewDidLoad() {
        console.log('Hello Events Page');
    }

    //call these methods everytime entering this view
    ionViewDidEnter() {
        console.log('entered events tab');
        this.doRefresh(null);
    }


    /**
     * Add to respective date arrays the events that match the same month
     */
    addEventsToSplitObject() {

        console.log('updating list of events...');

        /* clear all event arrays everytime filter is chosen; will be refilled from local storage */
        this.janEvents = [];
        this.febEvents = [];
        this.marchEvents = [];
        this.aprilEvents = [];
        this.mayEvents = [];
        this.juneEvents = [];
        this.julyEvents = [];
        this.augEvents = [];
        this.septEvents = [];
        this.octEvents = [];
        this.novEvents = [];
        this.decEvents = [];

        /* clear the event counts */
        this.janCount = null;
        this.febCount = null;
        this.marchCount = null;
        this.aprilCount = null;
        this.mayCount = null;
        this.juneCount = null;
        this.julyCount = null;
        this.augCount = null;
        this.septCount = null;
        this.octCount = null;
        this.novCount = null;
        this.decCount = null;

        var value = localStorage.getItem('events');
        //console.log(value);
        var valueObj = JSON.parse(value);
        this.events = valueObj.events;

        var events = this.events;
        //console.log(events);

        for (var i = 0; i < events.length; i++) {
            var event = events[i];
            //year is [0], month is [1], day is [2]
            var splitYearObj = event.date.split("-");
            var eventYear = splitYearObj[0];
            var eventMonth = splitYearObj[1];

            if (eventYear == this.selectedDate) {

                switch (eventMonth) {
                    case "01":
                        this.janEvents.push(event);
                        if (event.badge  && !event.happened) {
                            this.janCount++;
                        }
                        break;
                    case "02":
                        this.febEvents.push(event);
                        if (event.badge  && !event.happened) {
                            this.febCount++;
                        }
                        break;
                    case "03":
                        this.marchEvents.push(event);
                        if (event.badge  && !event.happened) {
                            this.marchCount++;
                        }
                        break;
                    case "04":
                        this.aprilEvents.push(event);
                        if (event.badge  && !event.happened) {
                            this.aprilCount++;
                        }
                        break;
                    case "05":
                        this.mayEvents.push(event);
                        if (event.badge  && !event.happened) {
                            this.mayCount++;
                        }
                        break;
                    case "06":
                        this.juneEvents.push(event);
                        if (event.badge  && !event.happened) {
                            this.juneCount++;
                        }
                        break;

                    case "07":
                        this.julyEvents.push(event);
                        if (event.badge && !event.happened) {
                            this.julyCount++;
                        }
                        break;

                    case "08":
                        this.augEvents.push(event);
                        if (event.badge && !event.happened) {
                            this.augCount++;
                        }
                        break;

                    case "09":
                        this.septEvents.push(event);
                        if (event.badge && !event.happened) {
                            this.septCount++;
                        }
                        break;

                    case "10":
                        this.octEvents.push(event);
                        if (event.badge && !event.happened) {
                            this.octCount++;
                        }
                        break;

                    case "11":
                        this.novEvents.push(event);
                        if (event.badge && !event.happened) {
                            this.novCount++;
                        }
                        break;

                    case "12":
                        this.decEvents.push(event);
                        if (event.badge && !event.happened) {
                            this.decCount++;
                        }
                        break;
                }
            }
        }

        //update events tab badge value
        console.log("updating events tab badge value...");
        this.navCtrl.parent._tabs[1].tabBadge = this.eventBadgeValue;

    }

    toSingleEvent(event) {
        console.log(event);
        this.navCtrl.push(SingleEvent, {
            title: event.title,
            id: event.id,
            event_code: event.event_code,
            date: event.date,
            time: event.time_range,
            location: event.location,
            description: event.description
        });
    }

    changeMonthDisplay(monthName) {
        this.display = monthName;
    }

    //get events and close refresher when done using event variable
    getEvents(event) {
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');

        let getEventsUrl = "http://phplaravel-36682-78164-214811.cloudwaysapps.com/admin/get/events/all";

        this.http.get(getEventsUrl,
            { headers: headers })
            .map(res => res.json())
            .subscribe(data => {

                var eventBadgeValue = 0;

                for (var i = 0; i < data.length; i++) {
                    var currentEvent = data[i];
                    //console.log(currentEvent);
                    var result_array = this.inTime(currentEvent.date, currentEvent.time_range);

                    if (result_array[0] && !result_array[2]) {

                        eventBadgeValue += 1;
                        //add badge attribute to make sure event badge is showed in drop down
                        data[i].badge = true;
                    }
                    else {
                        //console.log(currentEvent.title + " is out of 24 hour range");
                        data[i].badge = false;
                    }

                    //only round up time_until for positive time values
                    if(result_array[1] > 0){
                        data[i].time_until = Math.ceil(result_array[1]);
                    }
                    else{
                        data[i].time_until = result_array[1];
                    }
                    
                    data[i].happened = result_array[2];


                    // console.log(data[i].time_until);
                    // console.log(data[i].happened);

                }

                //console.log(data);
                localStorage.setItem('events', JSON.stringify({ events: data }));

                this.eventBadgeValue = eventBadgeValue;
                this.addEventsToSplitObject();


                //only close refresher when being used; null means the refresher is not involved
                if (event != null) {
                    event.complete();
                }

            }, error => {
                console.log("Server Error  " + error);
                this.showAlert('Server Error', "Our server is currently having difficulties. Please try again later!");

                if (event != null) {
                    event.cancel();
                }

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

  logout() {
    this.app.getRootNav().setRoot(Login).then(data => {
      console.log(data);
    }, (error) => {
      console.log(error);
    });
  }


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

    gotoProfile() {
        console.log("going to profile page...");
        this.navCtrl.push(Profile);
    }


}
