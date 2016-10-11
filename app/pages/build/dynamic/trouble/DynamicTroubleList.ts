import {NavController, Events, Loading, Toast} from 'ionic-angular';
import {Component} from '@angular/core';
import {GpsTrackService} from '../../../../providers/gps-track-service';
import {HttpService} from '../../service/HttpService';


import {UserInfoModel} from '../../model/UserInfoModel';
import {ProjectModel} from '../../model/ProjectModel';
import {TroubleTab} from '../trouble/troubletab'


import {Detail} from '../../dynamic/detail/Detail';



@Component({ templateUrl: "build/pages/build/dynamic/trouble/DynamicTroubleList.html" })


export class DynamicTroubleList {

    private dynamiclsit = {}
 
    private userinfo: UserInfoModel;
    private projects: ProjectModel[];
    private curpage:number=1;
    private totalpage:number=1;

    constructor(
        private httpserve: HttpService,
        private nav: NavController,
        private events: Events
    ) {

        httpserve.GetProject(this.curpage,10).then(res=>{
            this.projects=res.ProjectList;
             this.totalpage = res.TotalPages;
        });

    }
    Refresh() {
        var result = this.httpserve.GetProject(this.curpage,10).then(res =>this.projects=res.ProjectList);

    }
    SelectProject(project) {
        var project_id = project.project_id;
        this.nav.push(TroubleTab, { project: project });

    }
  Last(refresher:any)
  {
    if(this.curpage-1 >=1)
    {
        this.curpage = this.curpage-1;
  
          this.httpserve.GetProject(this.curpage,10).then(res=>{
            this.projects=res.ProjectList;
          });
          
     }
  }
  Next(refresher:any)
  {
   

    if(this.curpage+1 <=this.totalpage)
    {
        this.curpage = this.curpage+1;
  
          this.httpserve.GetProject(this.curpage,10).then(res=>{
            this.projects=res.ProjectList;
               refresher.complete();
          });
          
     }
  }




}


