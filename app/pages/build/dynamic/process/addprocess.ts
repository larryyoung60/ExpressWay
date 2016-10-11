import {NavController,NavParams, Events, Loading, Toast, Alert} from 'ionic-angular';
import {DatabaseService} from '../../../../providers/database-service';
import {Component} from '@angular/core';
import {GpsTrackService} from '../../../../providers/gps-track-service';
import {HttpService} from '../../service/HttpService';
import {PicList} from '../piclist/PicList';
import {PhotoAlbumModal} from '../../../../pages/common/photo-album-modal/photo-album-modal'
import {ProcessModel} from '../../model/ProcessModel'
import {BaseFormPage} from '../../../business/base/base-form';
import * as _ from 'lodash';

@Component ({templateUrl:'build/pages/build/dynamic/process/addprocess.html'})

export class AddProcess {
    
    private m_http:any;
    private dyParams:any;

    private project_id:any;
    private projectinfo:any;

    private nodes:any;
    protected medias: any[] = [];
    protected oldMedias: any[] = [];
    private process:any= {
            "pas_id":0,
            "project_id":"",
            "act_date":"",
            "act_process":"",
            "nodememo":""
        };


    constructor( events: Events,
                 private httpserve:HttpService,
                 private nav: NavController,
                 private navParams:NavParams,
                 dbService:DatabaseService)
    {
       // super(events , nav , navParams , dbService);   
        this.projectinfo = this.navParams.get("data");
        this.m_http = httpserve;
        this.dyParams = this.projectinfo;
        this.project_id = this.projectinfo.project_id;
        var myDate = new Date();
        var year = myDate.getFullYear().toString();
        var month = (parseInt(myDate.getMonth().toString()) + 1).toString(); //month是从0开始计数的，因此要 + 1
        if (month.length < 2) {
           month = "0" + month.toString();
           year = year+"-"+month;
        }
        else
        {
          year = year+"-"+month;
        }


        this.process.act_date = year;
         this.process.project_id = this.project_id;
       this.navParams.data.process= this.process;
        this.httpserve.GetProjectNodes(this.projectinfo.project_id).then(res=>{this.LoadProject(res)});
       
    }

    
    LoadProject(data)
    {
        this.nodes = data;
   
    }

    AddFj()
    {
          this.navParams.get("nav").push(PhotoAlbumModal,{data:this.projectinfo});
    }


    Save()
    {
        
       this.httpserve.SaveCurProcess(this.process).then(res=>{
      
            this.showMsg('保存成功',"成功");
       }).catch((d)=>{
        this.showMsg("失败",d);
      });
    }
  showMsg(title,msg){
    //console.log(msg)
    let alert = Alert.create({title: title, subTitle:msg , buttons: ["确定"]});
    this.nav.present(alert);
  }


}

