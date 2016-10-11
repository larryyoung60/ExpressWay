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

import {DiseaseFormPage} from './form';
import {CommonDetailPage} from '../../common/detail/detail';

import {DiseaseModel} from '../../../models/disease-model';
import {BaseTabsPage} from '../base/base-tabs';

@Component({
  templateUrl: 'build/pages/business/disease/tabs.html'
})
export class DiseaseTabsPage extends BaseTabsPage<DiseaseModel> {

  constructor(
    events: Events,
    nav: NavController,
    navParams: NavParams
  ) {
    super(events, nav, navParams , DiseaseModel);

    this.mainPage = DiseaseFormPage;
    this.detailPage = CommonDetailPage;

    //
    this.events.subscribe("changedetail" , res => {
      //删除原有数据
      this.detail.splice(0 , this.detail.length);
      //插入数据
      _.each(res[0] , (n)=>{
        this.detail.push(_.clone(n));
      });
      this.changeDetailStakeNum();
    });
    this.events.subscribe("changestakenum" , res => {
      this.changeDetailStakeNum();
    });
  }

  initPageOptions() {
    var opt = this.pageOptions;
    opt.type = "Disease";
    opt.tableName = "Local" + opt.type;
    opt.modelFields = ["id", "binghaiweizhi" , "caseID" , "catalog" , "chedao" , "companyID" , 
      "dealwith" , "deptName" , "fangxiang" , "memo" , "others" , "parentClg" , "reportTime" , "reporter" , 
      "routeName" , "routeNum" , "stakeNum" , "subClg" , "truename" , "userID" , "x" , "y"];

    opt.hasMedia = true;
    opt.mediaRequired = true;
    opt.mediaType = AppConstant.MediaType.Disease;

    opt.hasDetail = true;
    opt.detailFields = ["id" , 	"localParentId" , "remoteParentId" ,"catalog" , "dealWith" , "gongchengL" , 
      "jiliangDesc" , "jiliangDescSave" , "jiliangUnit" , "parentCatalog" , "stakeNum" , "subName" , 
      "sunhuaiqingkuang" , "timelist" , "weixiuFangAn"];
    opt.detailRequired = true;
    opt.detailTableName = "localDiseaseDetail";

    opt.useCoords = true;
 

    opt.loadingContent = "保存路况巡查信息";
  }

  getMainOptions(){
    return _.extend(super.getMainOptions() , {title:"病害信息"});
  }
  getDetailOptions(){
    return _.extend(super.getDetailOptions() , {title:"预估工程量" , enableCheckbox:true});
  }

  changeDetailStakeNum(){
    if (!(this.result.stakeNum && this.detail.length>0)) return;
    _.each(this.detail , (item , i)=>{
      try{
        item.stakeNum = this.result.stakeNum;
      }catch(e){
        console.log(e.message);
      }
    });

  }
  /** 验证主记录 */
  validRecord(form): SimpleResult {
    var rs: SimpleResult = { isok: true };
    
    var stakeNumError = "";
    switch (this.result.binghaiweizhi){
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
  
  /** 验证明细 */
  validDetail(): SimpleResult {
    var rs: SimpleResult = { isok: true };
    var detail = _.filter(this.detail , {isChecked:true});    
    if (this.pageOptions.detailRequired) {
      if (detail.length == 0){
        rs.isok = false;
        rs.message = this.pageOptions.detailInvalidMessage;
      }else{
        var emptyStakeItems = _.filter(detail , (n) => {
          return n.stakeNum == "K0+000";
        })
        if (emptyStakeItems.length>0){
          rs.isok = false;
          rs.message = "有"+emptyStakeItems.length+"条选中的记录没有填写桩号,请填写!";
        }
      }
    }
    return rs;
  }
  /** 设置主记录信息 , 重写 , 写入桩号 */
  setRecordData() {
    super.setRecordData();
    var record:DiseaseModel = this.submitedData.record;
    //处理桩号
    switch (record.binghaiweizhi) {
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
  
  /** 设置明细数据 */
  setDetailData() {
    var record = this.submitedData.record;    
    var detail = _.filter(this.detail , {isChecked:true});  
    _.each(detail, (n, o) => {
      n.localParentId = record.id;
    });
    console.log(detail)
    this.submitedData.detail = detail;
  }

}
