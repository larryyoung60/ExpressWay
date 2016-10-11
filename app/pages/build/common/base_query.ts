import {NavController, Loading, Refresher, Events, Popover} from 'ionic-angular';
import {Component} from '@angular/core';
import * as _ from 'lodash';
import * as moment from 'moment';
import * as Enumerable from 'linq';

import {UserService} from '../../../providers/user-service';
import {DatabaseService} from '../../../providers/database-service';
import {Resource} from '../../../providers/resource';
import {HttpService} from '../service/HttpService';

//import {MaintainModel} from '../../../models/maintain-model';
//import {MaintainTabsPage} from './tabs';

import {QueryConditionPopoverPage} from '../../common/query-condition-popover/query-condition-popover';


export abstract class BaseQueryPage<T> {
  protected condition: any = {
    road: "",
    direction: "",

  };
  protected safes = [];
  protected isLoading = false;



  constructor(
    protected httpserve:HttpService,
    protected nav: NavController,
    protected dbService: DatabaseService,
    protected events: Events
  ) {
    this.initCondition();
    this.initOptions();
   
  }
  initOptions() {

  }
  initCondition() {
  }
  /**初始化读取数据 */
  loadData() {

  }


}
