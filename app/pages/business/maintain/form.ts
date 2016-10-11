import {Events, NavController, NavParams, ViewController, Alert, Loading, Modal, Toast} from 'ionic-angular';
import {Component} from '@angular/core';
import {Geolocation} from 'ionic-native';
import * as _ from 'lodash';
import * as moment from 'moment';

import {AppConfig} from '../../../providers/app-config';
import {AppConstant} from '../../../providers/app-constant';
import {DatabaseService} from '../../../providers/database-service';
import {Resource} from '../../../providers/resource';
import {SettingService} from '../../../providers/setting-service';
import {UserService} from '../../../providers/user-service';

import {BaseFormPage} from '../base/base-form';
import {MaintainModel} from '../../../models/maintain-model';

/*
  填写维修任务
*/
@Component({
  templateUrl: 'build/pages/business/maintain/form.html',
})
export class MaintainFormPage extends BaseFormPage<MaintainModel> {
  public wxUsers = [];
  constructor(events: Events,nav: NavController,navParams : NavParams ,dbService: DatabaseService) {
    super(events , nav , navParams , dbService);
    this.loadData();
  }

  loadData() {
    this.getWXusers();
  }
  getWXusers(){
    var sql = `select * from Manager where companyID = '${this.currentUser.companyId}' and userStauts = '维修负责人'`;
    return this.dbService.query(sql)
      .then(items => {
        this.wxUsers = items;
        return items;
      })
      .then(items => {
        this.result.fuzeUser = items.length > 0 ? items[0].userName : ""
      });
  }
}
