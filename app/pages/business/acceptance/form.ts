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
import {AcceptanceModel} from '../../../models/acceptance-model';

/*
  填写验收任务
*/
@Component({
  templateUrl: 'build/pages/business/acceptance/form.html',
})
export class AcceptanceFormPage extends BaseFormPage<AcceptanceModel> {
  public remarks = ["合格" , "不合格"];
  public booleans = ["是" , "否"];
  public jlUsers = [];
  public wxUsers = [];

  constructor(events: Events,nav: NavController,navParams : NavParams ,dbService: DatabaseService) {
    super(events , nav , navParams , dbService);
    this.loadData();
  }
  loadData(){
    this.getJLusers();
    this.getWXusers();
  }
  /** 获取监理单位验收人 */
  getJLusers(){
    var sql = `select * from Manager where companyID = '${this.currentUser.companyId}' and userStauts = '监理单位验收人'`;
    return this.dbService.query(sql)
      .then(items => {
        this.jlUsers = items;
        return items;
      })
      .then(items => {
        this.result.ManageDeptChecker = items.length > 0 ? items[0].userName : ""
      });
  }
  /** 获取维修单位验收人 */
  getWXusers(){
    var sql = `select * from Manager where companyID = '${this.currentUser.companyId}' and userStauts = '维修单位验收人'`;
    return this.dbService.query(sql)
      .then(items => {
        this.wxUsers = items;
        return items;
      })
      .then(items => {
        this.result.RepairDeptChecker = items.length > 0 ? items[0].userName : ""
      });
  }
}
