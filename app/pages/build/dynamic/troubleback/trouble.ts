import {NavController,NavParams, Events, Loading, Toast} from 'ionic-angular';
import {DatabaseService} from '../../../../providers/database-service';
import {Component} from '@angular/core';
import {GpsTrackService} from '../../../../providers/gps-track-service';
import {HttpService} from '../../service/HttpService';

@Component ({templateUrl:'build/pages/build/dynamic/troubleback/trouble.html'})

export class Trouble {

  private mytrouble:any;
    
    private trouble:any={
        trouble_id:0,
        resolve:"",
        type:"",
        cur_status:-1,
        questions:[]
    };

    private ques_content = "";



    constructor(private httpserve:HttpService,  
                private nav: NavController,
                private navParams:NavParams,
                private events: Events)
    {
        this.mytrouble = this.navParams.get("data");  
        this.trouble.trou_id = this.mytrouble.trou_id;
        this.navParams.data.tjdata = this.trouble;

    }

    

}