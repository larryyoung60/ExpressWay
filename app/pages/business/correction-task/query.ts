import {NavController , Loading , Refresher , Events} from 'ionic-angular';
import {Component} from '@angular/core';
import * as _ from 'lodash';
import * as moment from 'moment';

import {UserService} from '../../../providers/user-service';
import {DatabaseService} from '../../../providers/database-service';
import {Resource} from '../../../providers/resource';

import {CorrectionReviewModel} from '../../../models/correction-review-model';
import {BaseQueryPage} from '../base/base-query';

@Component({
  templateUrl: 'build/pages/business/correction-task/query.html',
})
export class CorrectionTaskQueryPage extends BaseQueryPage<CorrectionReviewModel> {
    
  constructor(
    nav: NavController , 
    userService:UserService , 
    resource:Resource ,  
    dbService:DatabaseService ,
    events:Events
  ) {
      super(nav, userService , resource , dbService , events);
  }
  initOptions(){
  	this.loadingString = "查询整改任务记录";
    this.conditionRoadField = "highwayName";
  	this.conditionDirectionField = "fangxiang";
    this.orderByDateField = "askFinishedDate";
  }
  initCondition(){
    super.initCondition();
    this.condition.startTime = moment().add(-2 , "weeks").format('YYYY-MM-DD');
    this.condition.endTime = moment().format('YYYY-MM-DD');
  }

  getResource(){
    return this.resource.getCorrectionTask(this.condition);
  }
  /*
  filterTask(){
    var road = this.condition.road ,
        directions = this.condition.direction.split(":") ,
        upOrdown = directions[0] , 
        direction = directions[1];
   var tasks = _.filter(this.allTasks , (n)=>{     
      return n.highwayName == this.condition.road && n.fangxiang.indexOf(direction)>-1;
    });
    tasks.sort((n1 , n2)=>{
      return upOrdown == "上行" ? n1.stakeOrder - n2.stakeOrder : n2.stakeOrder - n1.stakeOrder;
    });
    this.tasks = tasks;
  }

  query(refresher?:Refresher):void{
    this.isLoading = true;
    let loading;
    var fromRefresher = !!refresher;
    if (!fromRefresher){
      loading = Loading.create({
        content: "查询整改复查记录"
      });
      this.nav.present(loading);
    }
    this.resource.getCorrectionTask(this.condition)
      .then(tasks => {
        if (!fromRefresher){
          loading.dismiss();          
        }else{
          refresher.complete();
        }
        this.isLoading = false;
        this.allTasks = _.map(_.isArray(tasks) ? tasks : [] , (n:any) => {
          //加桩号排序
          var stakeOrder = 0;
          //console.log(n.stakeNum)
          if (n.stakeNum && n.stakeNum.indexOf("+")>-1){
            var stakeArray = n.stakeNum.split("-")[0].replace(/k/ig , "").split("+");
            if (stakeArray.length > 1){
              stakeOrder = parseInt(stakeArray[0] || 0)*1000+parseInt(stakeArray[1]);
            }
          }
          n.stakeOrder = stakeOrder;

          var items = n["yuguGongchengliang"];
          var detail;
          if (_.isArray(items)) {
            var key = _.findKey(items[0], function (o) { return !!o });
            detail = _.map(items, key);
          } else if (_.isObject(items)) {
            var keys = _.keys(items);
            if (keys.length == 1){
              detail = [items[keys[0]]];
            }else{
              detail = items;
            }
          } else {
            detail = [];
          }
          //修改字段
          _.each(detail , (n) => {
            n.jiliangUnit = n.jlUnit;
            n.jiliangDesc = n.jlDesc;
            n.jiliangDescSave = n.jlDescNew;
            n.gongchengL = n.gongchengLiang;
          });          
          n["detail"] = detail;
          return <CorrectionReviewModel>n;
        });        
        this.filterTask();
      });
  }
  */
}
