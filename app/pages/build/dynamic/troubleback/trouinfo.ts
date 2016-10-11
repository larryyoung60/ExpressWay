import {NavController,NavParams, Events, Loading, Toast} from 'ionic-angular';
import {DatabaseService} from '../../../../providers/database-service';
import {Component} from '@angular/core';
import {GpsTrackService} from '../../../../providers/gps-track-service';
import {HttpService} from '../../service/HttpService';

@Component ({templateUrl:'build/pages/build/dynamic/troubleback/trouinfo.html'})

export class TroubleInfo {

  private trouble:any;


    constructor(private httpserve:HttpService,  
                private nav: NavController,
                private navParams:NavParams,
                private events: Events)
    {
        this.trouble = this.navParams.get("data");  


    }

    

}