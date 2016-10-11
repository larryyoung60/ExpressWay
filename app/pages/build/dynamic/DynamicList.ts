import {NavController, Events, Loading, Toast} from 'ionic-angular';
import {Component} from '@angular/core';
import {GpsTrackService} from '../../../providers/gps-track-service';
import {HttpService} from '../service/HttpService';


import {UserInfoModel} from '../model/UserInfoModel';
import {ProjectModel} from '../model/ProjectModel';


import {Detail} from '../dynamic/detail/Detail';



@Component({ templateUrl: "build/pages/build/dynamic/DynamicList.html" })


export class DynamicList {

    private dynamiclsit = {}
 
    private userinfo: UserInfoModel;
    private projects: ProjectModel[];
    private curpage:number=1;
    private totalpage:number=1;
    private isLoading = false;


    constructor(
        private httpserve: HttpService,
        private nav: NavController,
        private events: Events
    ) {

       // this.m_http = httpserve;
        //let userinfo: UserInfoModel;
       // this.m_http.login("admin" , "123")


        // var result = this.m_http.login("admin", "123");
        // result.map(res => res.json()).subscribe(res => {
        //     this.userinfo = res;
        //     this.m_http.SetUser(this.userinfo);
        //     var result = this.m_http.GetProject();
        //     result.subscribe(res => this.projects = JSON.parse(res._body).ProjectList);
        // });
        httpserve.GetProject(this.curpage,10).then(res=>{
               this.projects=res.ProjectList;
                this.totalpage = res.TotalPages;
            });

    }
    Refresh() {
        //this.httpserve.SetUser(this.userinfo);
        var result = this.httpserve.GetProject(this.curpage,10).then(res =>{
            this.projects=res.ProjectList;
                this.totalpage = res.TotalPages;
            });

    }
    SelectProject(project) {
        var project_id = project.project_id;
        this.nav.push(Detail, { project: project });

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


