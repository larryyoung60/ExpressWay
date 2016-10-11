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



@Component ({templateUrl:'build/pages/build/safe/randomsafe.html'})

export class RandomSafe  {
    
    private m_http:any;
    private loadingString:any;
    protected userinfo:any;
    private loc_content:string;

    private result:any={
       title:"",
       plan_begin:"",
       end_time:"",
       item_title:"",
       item_content:"",
        checkno:"",
        check_type :"random"
    }




    public infoParams:any = {
        title: "安全检查信息" , 
        icon:"information-circle"
    };



    

    constructor( 
                  httpserve:HttpService,
                 nav: NavController,
                 navParams:NavParams,
                 dbService:DatabaseService,
                 events: Events)
    {
        // super(events , nav , navParams , dbService);  
        navParams.data.result = this.result;

         

        
    }

  initOptions(){
  	this.loadingString = "查询安全检查";
   
  }
  LoadUser(res)
  {
    this.userinfo = res;
  }
   /** 获取打开照片选择框的选项 */
  getMediaOptions(): Object {
    return {
      title: "照片影音记录",
      icon: "images",
      badgeStyle: "danger",
      oldTitle: "历史照片"
    };
  }
  // Save()
  // {
  //     var SafeCheckAllView:any =  {}
  //     var safeinfo:any ={};
  //     var safecheckperson:any= []
  //     var questions:any=[];
  //     var filelist:string[];

  //     safeinfo.checkno = "";
  //     safeinfo.check_type ="random";
  //     safeinfo.end_time = this.end_time;
  //     safeinfo.start_time = this.plan_begin;
  //     safeinfo.plan_time = this.plan_begin;
  //     safeinfo.title = this.title;
  //     questions.push({item_title:this.item_title,item_conten:this.item_content});
  //     safecheckperson.push({emp_id:HttpService._currentUser._currentUser.user_id})

  //     SafeCheckAllView.safeinfo = safeinfo;
  //     SafeCheckAllView.safecheckperson =safecheckperson;
  //     SafeCheckAllView.questions = questions;
  //     SafeCheckAllView.filelist=filelist;

  //     this.m_http.SaveSafeCheckMessage(SafeCheckAllView).map(res=>res.json()).subscribe(res=>{


  //     })


  // }


}