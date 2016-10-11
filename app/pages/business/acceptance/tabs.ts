import {Component, ViewChild} from '@angular/core';
import {NgForm} from '@angular/common';
import {Events, NavController, NavParams, ViewController, Alert, Loading, Modal, Toast} from 'ionic-angular';
import * as _ from 'lodash';
import * as moment from 'moment';

import {AppConfig} from '../../../providers/app-config';
import {AppConstant} from '../../../providers/app-constant';
import {DatabaseService} from '../../../providers/database-service';
import {Resource} from '../../../providers/resource';
import {SettingService} from '../../../providers/setting-service';
import {UserService} from '../../../providers/user-service';

import {AcceptanceFormPage} from './form';
import {AcceptanceInfoPage} from './info';
import {CommonDetailPage} from '../../common/detail/detail';

import {AcceptanceModel} from '../../../models/acceptance-model';
import {BaseTabsPage} from '../base/base-tabs';

@Component({
  templateUrl: 'build/pages/business/acceptance/tabs.html'
})
export class AcceptanceTabsPage extends BaseTabsPage<AcceptanceModel> {

  public infoPage = AcceptanceInfoPage;
  public infoParams:any = {
    title: "派单信息" , 
    icon:"information-circle"
  };


  constructor(
    events: Events,
    nav: NavController,
    navParams: NavParams , 
    private resource: Resource
  ) {
    super(events, nav, navParams , AcceptanceModel);
    var maintainItem = navParams.get("item");
    _.extend(this.result , maintainItem);   
    this.initResult();

    var detail = maintainItem.detail;
    _.each(detail , (n) => {
      this.detail.push(n);
    });
    this.mainPage = AcceptanceFormPage;
    this.detailPage = CommonDetailPage;
    _.extend(this.infoParams , {result:this.result});

    this.getOldMedias();

  }
  initResult(){
    let rs = <AcceptanceModel>this.result;
    rs.Remark = "合格";
    
    rs.PDAFeedbackTime = moment().format("YYYY-MM-DD");
    rs.IsAgreeAudit = "是";
    rs.CheckReporter = this.currentUser.truename;
  }

  initPageOptions() {
    var opt = this.pageOptions;
    opt.type = "Acceptance";
    opt.tableName = "Local" + opt.type;
    opt.modelFields = ["id", "AskFinsihedTime" , "AskPDAFinishedTime" , "CheckReporter" , "FeedbackTime" , 
      "IsAgreeAudit" , "IsView" , "ManageDeptChecker" , "MantanceManager" , "PDAFeedbackTime" , "PDAUsername" , 
      "ReceivedUnitName" , "Remark" , "RepairDeptChecker" , "SendToPDATime" , "SendsingleTime" , 
      "YanshouPaidanRen" , "caseID" , "gongchengweizhi" , "routeName" , "sendsingManager" , "weixiuFangAn" , 
      "xuhao" , "yanghuXiangmu" , "yanshouFeedbackDesc"];

    opt.hasMedia = true;
    opt.mediaRequired = true;
    opt.mediaType = AppConstant.MediaType.Acceptance;

    opt.hasDetail = true;
    opt.detailFields = ["id" , 	"localParentId" , "remoteParentId" ,"catalog" , "dealWith" , "gongchengL" , 
      "jiliangDesc" , "jiliangDescSave" , "jiliangUnit" , "parentCatalog" , "stakeNum" , "subName" , 
      "sunhuaiqingkuang" , "timelist" , "weixiuFangAn"];
    opt.detailRequired = true;
    opt.detailTableName = "localDiseaseDetail";
    opt.useCoords = false;

    opt.saveButtonText = "发送";
    opt.loadingContent = "保存验收反馈";
  }

  getMainOptions(){
    return _.extend(super.getMainOptions() , {title:"验收反馈"});
  }
  getDetailOptions(){
    return _.extend(super.getDetailOptions() , {title:"验收工程量"});
  }
  getMediaOptions(){
    return _.extend(super.getMediaOptions() , {title:"验收照片" , oldTitle:"上报照片"});
  }

  afterSave() {
    this.events.publish('database:add', this.pageOptions.type, _.clone(this.submitedData.record));
    //this.reset();
    this.nav.pop();
    this.events.publish("successback" , this.submitedData.record);
  }

  /** 获取上报照片 */
  getOldMedias() {
    this.oldMediaLoading = true;
    var condition = {
      caseId: this.result.caseID ,
      status: 2
    };
    return this.resource.getDiseaseImage(condition)
      .then(photos => {
        /**
        var medias = _.map(photos , (photo:any , ix) => {
          return {
            ix: ix,
            isBase64: true,
            path: photo.filename,
            data: photo.fileData , 
            status: photo.filestatus
          };
        });
        var g = _.groupBy(medias , "status");
        _.forEach(g , (v , key) => {
          this.oldMedias.push({name:key , medias:v});
        });
        this.oldMedias.sort((n1 , n2) => {
          return n2.name.indexOf("上报") - n1.name.indexOf("上报");
        });
        */
        _.each(photos, (photo: { fileData: string; filename: string; filestatus:string}, ix) => {
          this.oldMedias.push({
            ix: ix,
            isBase64: true,
            path: photo.filename,
            data: photo.fileData , 
            status: photo.filestatus
          });
        });
        this.oldMedias.sort((n1 , n2) => {
          return n2.status.indexOf("上报") - n1.status.indexOf("上报");
        });        
        this.oldMediaLoading = false;
        return this.oldMedias;
      })
      .catch(err => {
        console.log(err);
      });
  }
}
