import {NavController, Events, Loading, Toast} from 'ionic-angular';
import {Component} from '@angular/core';
import {GpsTrackService} from '../../../../providers/gps-track-service';
import {HttpService} from '../../service/HttpService';


import {UserInfoModel} from '../../model/UserInfoModel';
import {TroubleModel} from '../../model/TroubleModel';
import {BackTab} from '../troubleback/backtab'


import {Detail} from '../../dynamic/detail/Detail';



@Component({ templateUrl: "build/pages/build/dynamic/troubleback/backlist.html" })


export class BackList {

    private dynamiclsit = {}
 
    private userinfo: UserInfoModel;
    private troubles: TroubleModel[];
    private curpage:number=1;
    private totalpage:number=1;

    constructor(
        private httpserve: HttpService,
        private nav: NavController,
        private events: Events
    ) {

        httpserve.GetTroubleList(this.curpage,10).then(res=>{
            this.troubles=res.data;
             this.totalpage = res.TotalPages;
        });

    }
    Refresh() {

        var result = this.httpserve.GetTroubleList(this.curpage,10).then(res =>this.troubles=res.data);

    }
    SelectProject(trouble) {
        var trou_id = trouble.trou_id; 
        this.nav.push(BackTab, { trouble: trouble });

    }
  Last(refresher:any)
  {
    if(this.curpage-1 >=1)
    {
        this.curpage = this.curpage-1;
  
          this.httpserve.GetTroubleList(this.curpage,10).then(res=>{
            this.troubles=res.data;
          });
          
     }
  }
  Next(refresher:any)
  {
   

    if(this.curpage+1 <=this.totalpage)
    {
        this.curpage = this.curpage+1;
  
          this.httpserve.GetTroubleList(this.curpage,10).then(res=>{
            this.troubles=res.data;
               refresher.complete();
          });
          
     }
  }




}


