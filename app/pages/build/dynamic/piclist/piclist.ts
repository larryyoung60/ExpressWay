import {NavController,NavParams, Events, Loading, Toast} from 'ionic-angular';
import {DatabaseService} from '../../../../providers/database-service';
import {Component} from '@angular/core';
import {GpsTrackService} from '../../../../providers/gps-track-service';
import {HttpService} from '../../service/HttpService';


@Component ({templateUrl:'build/pages/build/dynamic/piclist/piclist.html'})

export class PicList {
    
    private m_http:any;
    private pas_id:any;
    private project_id:any;

    private piclist:any;


    constructor(private httpserve:HttpService,
                private nav: NavController,
                private navParams:NavParams,
                private events: Events)
    {

        this.pas_id = this.navParams.get("data").pas_id;
        this.project_id = this.navParams.get("data").project_id;
        this.m_http = httpserve;

        this.m_http.GetActProcessPic(this.project_id,this.pas_id).map(res=>res.json()).subscribe(res=>{this.LoadProject(res)});

    }

    LoadProject(data)
    {
        this.piclist = data;
    }


}
