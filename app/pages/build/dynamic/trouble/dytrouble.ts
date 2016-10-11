import {NavController,NavParams, Events, Loading, Toast} from 'ionic-angular';
import {DatabaseService} from '../../../../providers/database-service';
import {Component} from '@angular/core';
import {GpsTrackService} from '../../../../providers/gps-track-service';
import {HttpService} from '../../service/HttpService';

@Component ({templateUrl:'build/pages/build/dynamic/trouble/dytrouble.html'})

export class DyTrouble {

    private project:any;
    
    private trouble:any={
        project_id:0,
        trou_desc:"",
        trou_type:"",
        find_date:"",
        limit_date:"",
        isstop:0,
        loc_type:"",
        officer:false,   
        loc:false,
        survey:false,
        design:false,
        build:false
    };

    private ques_content = "";



    constructor(private httpserve:HttpService,  
                private nav: NavController,
                private navParams:NavParams,
                private events: Events)
    {
        this.project = this.navParams.get("data"); 
         this.trouble.project_id = this.project.project_id
       this.navParams.data.trouble = this.trouble;
    }

    

}