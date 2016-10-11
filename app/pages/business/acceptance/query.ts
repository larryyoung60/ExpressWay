import {NavController , Loading , Refresher , Events , Popover} from 'ionic-angular';
import {Component} from '@angular/core';
import * as _ from 'lodash';
import * as moment from 'moment';

import {UserService} from '../../../providers/user-service';
import {DatabaseService} from '../../../providers/database-service';
import {Resource} from '../../../providers/resource';

import {AcceptanceModel} from '../../../models/acceptance-model';

import {AcceptanceTabsPage} from './tabs';

import {BaseQueryPage} from '../base/base-query';


@Component({
  templateUrl: 'build/pages/business/acceptance/query.html',
})
export class AcceptanceQueryPage extends BaseQueryPage<AcceptanceModel> {

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
  	this.loadingString = "查询验收任务";
  	this.conditionDirectionField = "gongchengweizhi";
    this.orderByDateField = "AskPDAFinishedTime";
    this.orderByDateFormat = "YYYY-MM-DD";
    
  }
  getResource(){
    return this.resource.getAcceptanceTask(this.condition);
  }
  
  /** 进入维修信息界面 */
  accept(item:AcceptanceModel){
    this.nav.push(AcceptanceTabsPage , {item:item});
  }
}
