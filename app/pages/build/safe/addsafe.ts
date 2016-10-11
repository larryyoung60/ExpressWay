import {NavController,NavParams, Events, Loading, Toast} from 'ionic-angular';
import {DatabaseService} from '../../../providers/database-service';
import {Component} from '@angular/core';
import {GpsTrackService} from '../../../providers/gps-track-service';
import {Resource} from '../../../providers/resource';
import {HttpService} from '../service/HttpService';
import {PhotoAlbumModal} from '../../../pages/common/photo-album-modal/photo-album-modal'
import {SafeModel} from '../model/safemodel'
import {BaseFormPage} from '../../build/common/base_form';
import {SafeCompany} from '../model/safecompany';
import {UserService} from '../../../providers/user-service';
import * as _ from 'lodash';

import {SafeTabs} from '../safe/tab';



@Component ({templateUrl:'build/pages/build/safe/addsafe.html'})

export class AddSafe   {
    
    private m_http:any;
    private dyParams:any;
    private loadingString:any;
    protected userinfo:any;
    private safeinfo:any;
    private questions:any;
    private loc_content:string;

    public infoParams:any = {
        title: "安全检查信息" , 
        icon:"information-circle"
    };


    constructor( 
                 private  httpserve:HttpService,
                 nav: NavController,
                 private navParams:NavParams,
                 dbService:DatabaseService,
                 events: Events)
    {
      //  super(events , nav , navParams , dbService);  
   
         this.m_http = httpserve;
         
         this.safeinfo = navParams.get("data");
      

          this.httpserve.GetSafeListById(this.safeinfo.safe_id).then(res=>{
            this.load(res);
          })



  

 

        
    }

  initOptions(){
  	this.loadingString = "查询安全检查";
   
  }
  load(res) {
    this.questions = res.questions;
            var result = {
          check_item:"",
          cur_status:"已提交",
          filelist:[],
          fill_type:"已提交",
          isok:0,
          loc_content:this.loc_content,
          loc_id: UserService.StaticCurrent.loc_id,
          ques:this.questions
        }
        this.navParams.data.result  = result;
    

  }


}