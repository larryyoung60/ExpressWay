import {NavController, Loading, Refresher, Events, Popover} from 'ionic-angular';
import {Component} from '@angular/core';
import * as _ from 'lodash';
import * as moment from 'moment';
import * as Enumerable from 'linq';

import {UserService} from '../../../providers/user-service';
import {DatabaseService} from '../../../providers/database-service';
import {Resource} from '../../../providers/resource';

import {MaintainModel} from '../../../models/maintain-model';

import {MaintainTabsPage} from './tabs';

import {BaseQueryPage} from '../base/base-query';



@Component({
  templateUrl: 'build/pages/business/maintain/query.html',
})
export class MaintainQueryPage extends BaseQueryPage<MaintainModel>  {
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
  	this.loadingString = "查询维修任务";
    //this.conditionRoadField = "routeName";
  	this.conditionDirectionField = "gongchengWeizhi";
    this.orderByDateField = "askFinishedDate";
  }
  getResource(){
    return this.resource.getMaintainTask(this.condition);
  }

  /** 进入维修信息界面 */
  maintain(item: MaintainModel) {
    this.nav.push(MaintainTabsPage, { item: item });
  }
}
