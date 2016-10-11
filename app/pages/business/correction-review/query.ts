import {NavController , Loading , Refresher , Events} from 'ionic-angular';
import {Component} from '@angular/core';
import * as _ from 'lodash';
import * as moment from 'moment';

import {UserService} from '../../../providers/user-service';
import {DatabaseService} from '../../../providers/database-service';
import {Resource} from '../../../providers/resource';

import {CorrectionReviewModel} from '../../../models/correction-review-model';

import {CorrectionReviewTabsPage} from './tabs';
import {BaseQueryPage} from '../base/base-query';

@Component({
  templateUrl: 'build/pages/business/correction-review/query.html',
})
export class CorrectionReviewQueryPage extends BaseQueryPage<CorrectionReviewModel> {  
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
  	this.loadingString = "查询整改复查记录";
    this.conditionRoadField = "highwayName";
  	this.conditionDirectionField = "fangxiang";
    this.orderByDateField = "askFinishedDate";
    this.orderByStakeField = "stakeOrder";
  }


  getResource(){
    return this.resource.getCorrectionReviewTask(this.condition);
  }

  /** 进入维修信息界面 */
  maintain(item:CorrectionReviewModel){
    this.nav.push(CorrectionReviewTabsPage , {item:item});
  }
}
