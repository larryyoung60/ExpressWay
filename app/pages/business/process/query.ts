// import {NavController, Events, Loading, Toast} from 'ionic-angular';
// import {Component} from '@angular/core';
// import {GpsTrackService} from '../../../providers/gps-track-service';
// import {HttpService} from '../service/HttpService';

// import {UserInfoModel} from '../model/UserInfoModel';
// import {ProjectModel} from '../model/ProjectModel';


// import {Detail} from '../dynamic/detail/Detail';



// @Component ({templateUrl:"build/pages/build/dynamic/DynamicList.html"})

// export class ProcessQueryPage {

//     private dynamiclsit = {}
//     private m_http;
//     private userinfo: UserInfoModel;
//     private projects:ProjectModel[];


//  constructor(
//     private httpserve:HttpService,
//     private nav: NavController,
//     private events: Events
//   )
//   {
 
//       this.m_http = httpserve;
//       let userinfo:UserInfoModel;

//       var result = this.m_http.login("admin","123");
//       result.map(res=>res.json()).subscribe(res=>{
//         this.userinfo =res;
//          this.m_http.SetUser(this.userinfo);
//         var result = this.m_http.GetProject();
//         result.subscribe(res=>this.projects = JSON.parse(res._body).ProjectList);
//   });


//   }
//     Refresh()
//     {
//         this.m_http.SetUser(this.userinfo);
//         var result = this.m_http.GetProject();
//         result.subscribe(res=>this.projects = JSON.parse(res._body).ProjectList);

//     }
//     SelectProject(project)
//     {
//         var project_id = project.project_id;
//         this.nav.push(Detail,{project:project});

//     }

// }




// // import {NavController , Loading , Refresher , Events} from 'ionic-angular';
// // import {Component} from '@angular/core';
// // import * as _ from 'lodash';
// // import * as moment from 'moment';

// // import {UserService} from '../../../providers/user-service';
// // import {DatabaseService} from '../../../providers/database-service';
// // import {Resource} from '../../../providers/resource';

// // import {CorrectionReviewModel} from '../../../models/correction-review-model';

// // import {CorrectionReviewTabsPage} from './tabs';
// // import {BaseQueryPage} from '../base/base-query';

// // @Component({
// //   templateUrl: 'build/pages/business/process/query.html',
// // })
// // export class CorrectionReviewQueryPage extends BaseQueryPage<CorrectionReviewModel> {  
// //   constructor(
// //     nav: NavController , 
// //     userService:UserService , 
// //     resource:Resource ,  
// //     dbService:DatabaseService ,
// //     events:Events
// //   ) {
// //       super(nav, userService , resource , dbService , events);
// //   }
// //   initOptions(){
// //   	this.loadingString = "查询整改复查记录";
// //     this.conditionRoadField = "highwayName";
// //   	this.conditionDirectionField = "fangxiang";
// //     this.orderByDateField = "askFinishedDate";
// //     this.orderByStakeField = "stakeOrder";
// //   }


// //   getResource(){
// //     return this.resource.getCorrectionReviewTask(this.condition);
// //   }

// //   /** 进入维修信息界面 */
// //   maintain(item:CorrectionReviewModel){
// //     this.nav.push(CorrectionReviewTabsPage , {item:item});
// //   }
// // }
