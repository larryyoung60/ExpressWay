import {NavController,NavParams, Events, Loading, Toast} from 'ionic-angular';
import {DatabaseService} from '../../../../providers/database-service';
import {Component} from '@angular/core';
import {GpsTrackService} from '../../../../providers/gps-track-service';
import {HttpService} from '../../service/HttpService';
import {PicList} from '../piclist/PicList';
import {AddProcess} from '../process/AddProcess';


@Component ({templateUrl:'build/pages/build/dynamic/process/dyprocess.html'})

export class DyProcess {
    
    private m_http:any;

    private project_id:any;
    private projectinfo:any;
    private months:any;
    
    private process:any;


    constructor(private httpserve:HttpService,
                private nav: NavController,
                private navParams:NavParams,
                private events: Events)
    {

        this.project_id = this.navParams.get("data").project_id;
        this.m_http = httpserve;

        httpserve.GetProjectInfo(this.project_id).then(rep=>this.projectinfo =rep)
 //       this.m_http.GetProjectInfo(this.project_id).map(res=>res.json()).subscribe(res=>{this.LoadProject(res)});
        this.m_http.GetActProcess(this.project_id).then(res=>{this.LoadProcess(res)});
    }



    LoadProcess(data)
    {
        this.process = data;

     
        for (var  i =0 ;i<  this.process.length;i ++ )
       {
           if(this.process[i].type == "dep")
            this.process[i].type= "建交局"
            if(this.process[i].type == "loc")
            this.process[i].type= "投资方"
             if(this.process[i].type == "officer")
            this.process[i].type= "监理"
            if(this.process[i].type == "sys")
                this.process[i].type= "实际进度"
       } 
       this.months = this.process.sort((n1,n2)=>{
        return n1.act_date-n2.act_date;
    });
    }


    SelectProject(item)
    {

        this.navParams.get("nav").push(PicList,{data:item});
    }

    Add()
    {
        this.navParams.get("nav").push(AddProcess,{data:this.projectinfo});
    }
}

