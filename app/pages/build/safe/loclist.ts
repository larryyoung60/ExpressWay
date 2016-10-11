import {NavController,NavParams, Events, Loading, Toast} from 'ionic-angular';
import {DatabaseService} from '../../../providers/database-service';
import {Component} from '@angular/core';
import {GpsTrackService} from '../../../providers/gps-track-service';
import {Resource} from '../../../providers/resource';
import {HttpService} from '../service/HttpService';
import {PhotoAlbumModal} from '../../../pages/common/photo-album-modal/photo-album-modal'
import {SafeModel} from '../model/safemodel'
import {BaseQueryPage} from '../../build/common/base_query';
import {RandomSafe} from '../safe/randomsafe';
import {EmptyTab} from '../safe/emptytab';
import * as _ from 'lodash';

import {SafeTabs} from '../safe/tab';



@Component ({templateUrl:'build/pages/build/safe/loclist.html'})

export class LocList {
    
    private m_http:any;
    private dyParams:any;
    private loadingString:any;
    protected userinfo:any;
    private complist:any;
 

    public infoParams:any = {
        title: "安全检查信息" , 
        icon:"information-circle"
    };


    constructor( events: Events,
                 private httpserve:HttpService,
                 private nav: NavController,
                 private navParams:NavParams,
                 dbService:DatabaseService)
    {
         //super(httpserve,nav, dbService , events);

          this.dyParams = {"data":navParams.data , nav:this.nav,"medias":[]};
          this.httpserve.GetSafeCompListById(navParams.data.safe_id).then(res=>{
            this.complist=res;
          });
    

        
    }
  initOptions(){
  	this.loadingString = "查询安全检查";
   
  }


  /** 进入维修信息界面 */
  selectSafe(item: any) {
    this.navParams.data =  item
    this.dyParams = this.navParams
    this.dyParams.result = item;
       
    this.nav.push(SafeTabs, this.dyParams);
  }

}