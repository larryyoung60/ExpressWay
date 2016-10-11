import {Component, ViewChild} from '@angular/core';
import {NgForm} from '@angular/common';
import {Events, NavController, NavParams, ViewController, Alert, Loading, Modal, Toast} from 'ionic-angular';
import * as _ from 'lodash';
import {AppConfig} from '../../../providers/app-config';
import {AppConstant} from '../../../providers/app-constant';
import {DatabaseService} from '../../../providers/database-service';
import {Resource} from '../../../providers/resource';
import {SettingService} from '../../../providers/setting-service';
import {UserService} from '../../../providers/user-service';

import {CorrectionFormPage} from './form';
import {CommonDetailPage} from '../../common/detail/detail';

import {CorrectionModel} from '../../../models/correction-model';
import {BaseTabsPage} from '../base/base-tabs';

@Component({
  templateUrl: 'build/pages/business/correction/tabs.html'
})
export class CorrectionTabsPage extends BaseTabsPage<CorrectionModel> {

  constructor(
    events: Events,
    nav: NavController,
    navParams: NavParams
  ) {
    super(events, nav, navParams , CorrectionModel);
    this.tabsIndex = ["form" , "media"];
    this.mainPage = CorrectionFormPage;
  }

  initPageOptions() {
    var opt = this.pageOptions;
    opt.type = "Correction";
    opt.tableName = "Local" + opt.type;
    opt.modelFields = ["id", "beizhu" , "caseCatalog" , "checkDate" , "chedao" , "companyID" , "fangxiang" , 
      "highwayName" , "jianchaUnit" , "jianchaUsername" , "koufen" , "note" , "reporterID" , "reporterName" , 
      "stakeNum" , "subCatalog" , "yanghuUnit" , "zhengaiYuanyin" , "zhenggaiFangshi" , "zhenggaiQixian" , 
      "zhuanghaoweizhi"];

    opt.hasMedia = true;
    opt.mediaRequired = true;
    opt.mediaType = AppConstant.MediaType.Correction;

    opt.hasDetail = false;
    opt.loadingContent = "保存整改通知信息";
  }
  
  getMainOptions(){
    return _.extend(super.getMainOptions() , {title:"整改信息"});
  }

  /** 验证主记录 */
  validRecord(form): SimpleResult {
    var rs: SimpleResult = { isok: true };
    
    var stakeNumError = "";
    switch (this.result.zhuanghaoweizhi){
      case "道路桩号":
      case "联络线":
        if (this.result.stakeNumK1 && this.result.stakeNumP1){
          if (this.result.stakeNumK1.length > 4 || this.result.stakeNumP1.length > 3){
            stakeNumError = "请填写正确的桩号! (例如:K1234+123)"
          }
        }
        break;
      case "区间":
        if (this.result.stakeNumK1 && this.result.stakeNumP1){
          if (this.result.stakeNumK1.length > 4 || this.result.stakeNumP1.length > 3){
            stakeNumError = "请填写正确的开始桩号! (例如:K1234+123)"
          }
        }
        if (this.result.stakeNumK2 && this.result.stakeNumP2){
          if (this.result.stakeNumK2.length > 4 || this.result.stakeNumP2.length > 3){
            stakeNumError = "请填写正确的结束桩号! (例如:K1234+123)"
          }
        }
        break;
    }
    if (!form.valid || stakeNumError) {
      rs.isok = false;
      var msg = [];
      if (!form.valid) msg.push(this.pageOptions.recordInvalidMessage);
      if (stakeNumError) msg.push(stakeNumError);
      rs.message = msg.join("<br>");
    }
    return rs;
  }


  /** 设置主记录信息 , 重写 , 写入桩号 */
  setRecordData() {
    super.setRecordData();
    var record:CorrectionModel = this.submitedData.record;
    //处理桩号
    switch (record.zhuanghaoweizhi) {
      case "道路桩号":
        record.stakeNum = `K${record.stakeNumK1}+${record.stakeNumP1}`;
        break;
      case "联络线":
        record.stakeNum = `K${record.stakeNumK1}+${record.stakeNumP1}`;
        break;
      case "区间":
        record.stakeNum = `K${record.stakeNumK1}+${record.stakeNumP1}-K${record.stakeNumK2}+${record.stakeNumP2}`;
        break;
      case "其他":
        break;
    }
    /**避免车道为undefined */
    if (!record.chedao) record.chedao = "";
  }
}
