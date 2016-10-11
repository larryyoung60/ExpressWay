import {NavController,NavParams, Events, Loading, Toast} from 'ionic-angular';
import {DatabaseService} from '../../../providers/database-service';
import {Component} from '@angular/core';
import {GpsTrackService} from '../../../providers/gps-track-service';
import {HttpService} from '../service/HttpService';

@Component ({templateUrl:'build/pages/build/safe/mainpage.html'})

export class MainPage {

    private safeinfo:any;
    private m_http:any;



    constructor(private httpserve:HttpService,
                private nav: NavController,
                private navParams:NavParams,
                private events: Events)
    {

        this.safeinfo = this.navParams.get("data");
        this.m_http = httpserve;
    }

    

}