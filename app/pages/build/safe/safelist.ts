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
import {UserService} from '../../../providers/user-service';
import {LocList} from '../safe/loclist';
import * as _ from 'lodash';

import {SafeTabs} from '../safe/tab';



@Component ({templateUrl:'build/pages/build/safe/safelist.html'})

export class SafeList {
    
    private m_http:any;
    private dyParams:any;
    private loadingString:any;
    protected userinfo:any;
    private safes:any;
    private curpage:number=1;
    private totalpage:number=1;

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
          this.httpserve.GetSafeListPage(1,10).then(res=>{
            this.safes=res.data;
            this.totalpage = res.TotalPages;
          });
    

        
    }
  initOptions(){
  	this.loadingString = "查询安全检查";
   
  }
 AddRandom()
 {
    this.navParams.data =  {safe_id:0};
    this.dyParams = this.navParams
    this.nav.push(EmptyTab, this.dyParams);
 }


  /** 进入维修信息界面 */
  selectSafe(item: SafeModel) {
    this.navParams.data =  item
    this.dyParams = this.navParams
  
    if(UserService.StaticCurrent.loc_type != "dep")
    {
    
       this.httpserve.GetSafeSignCompany(this.navParams.data.safe_id,UserService.StaticCurrent.loc_id).then(res=>{
            this.dyParams.result = res;
             this.nav.push(SafeTabs, this.dyParams);
          });

    }  
    else
      this.nav.push(LocList, this.dyParams);

  }

  Last()
  {
    if(this.curpage-1 >=1)
    {
        this.curpage = this.curpage-1;
  
          this.httpserve.GetSafeListPage(this.curpage,10).then(res=>{
            this.safes=res.data;
          });
          
     }
  }
  Next(refresh:any)
  {
    if(this.curpage+1 <=this.totalpage)
    {
        this.curpage = this.curpage+1;
  
          this.httpserve.GetSafeListPage(this.curpage,10).then(res=>{
            this.safes=res.data;
            refresh.complete();
          });
          
     }
  }

}