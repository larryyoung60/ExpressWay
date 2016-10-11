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

import {CorrectionReviewFormPage} from './form';
import {CorrectionReviewInfoPage} from './info';

import {CorrectionReviewModel} from '../../../models/correction-review-model';
import {BaseTabsPage} from '../base/base-tabs';

@Component({
  templateUrl: 'build/pages/business/correction-review/tabs.html'
})
export class CorrectionReviewTabsPage extends BaseTabsPage<CorrectionReviewModel> {

  public infoPage = CorrectionReviewInfoPage;
  public infoParams:any = {
    title: "整改信息" , 
    icon:"information-circle"
  };

  constructor(
    events: Events,
    nav: NavController,
    navParams: NavParams , 
    private resource: Resource
  ) {
    super(events, nav, navParams , CorrectionReviewModel);
    this.tabsIndex = ["form" , "media"];
    
    var maintainItem = navParams.get("item");
    _.extend(this.result , maintainItem);   
    
    //转换一下日期
    this.result.askFinishedDate = moment(this.result.askFinishedDate).format("YYYY-MM-DD");
    this.result.checkDate = moment(this.result.checkDate).format("YYYY-MM-DD");

    this.initResult();

    var detail = maintainItem.detail;
    _.each(detail , (n) => {
      this.detail.push(n);
    });
    this.mainPage = CorrectionReviewFormPage;
    _.extend(this.infoParams , {result:this.result});

    this.getOldMedias();
  }

  initResult(){
    let rs = <CorrectionReviewModel>this.result;
    rs.feedbackUser = rs.jianchaUsername;
    rs.fuchaResult = "合格";
    rs.feedbackTime = moment().format("YYYY-MM-DD");
    rs.fuchaKoufen = rs.koufen || "0";

    rs.reporterID = this.currentUser.id;
    rs.reporterName = this.currentUser.truename;
    rs.companyID = this.currentUser.companyId;
  }

  initPageOptions() {
    var opt = this.pageOptions;
    opt.type = "CorrectionReview";
    opt.tableName = "Local" + opt.type;
    opt.modelFields = ["id", "askFinishedDate" , "caseCatalog" , "caseID" , "checkDate" , "chedao" , 
      "companyID" , "fangxiang" , "feedbackTime" , "feedbackUser" , "fuchaDesc" , "fuchaKoufen" , "fuchaMemo" , 
      "fuchaResult" , "highwayName" , "jianchaUnit" , "jianchaUsername" , "koufen" , "padanTimes" , "reporterID" , 
      "reporterName" , "stakeNum" , "subCatalog" , "yanghuUnit" , "zhengaiYuanyin" , "zhenggaiQixian" , 
      "zhenggaiWanchengStatus" , "zhuanghaoweizhi"];

    opt.hasMedia = true;
    opt.mediaRequired = true;
    opt.mediaType = AppConstant.MediaType.CorrectionReview;

    opt.hasDetail = false;

    opt.saveButtonText = "发送";
    opt.loadingContent = "保存复查反馈";
  }

  getMainOptions(){
    return _.extend(super.getMainOptions() , {title:"复查反馈"});
  }
  getMediaOptions(){
    return _.extend(super.getMediaOptions() , {title:"照片影音记录" , oldTitle:"整改通知照片"});
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
      status: 1
    };
    let status = ["整改通知" , "整改反馈" , "其他"];
    let getStatus = function(status){
      var s = "";
      if (status.indexOf("上报")){
        s = "整改通知";
      }else if (status.indexOf("验收反馈")){
        s = "整改反馈";
      }else{  
        s = "其他";
      }
      return s;
    }
    return this.resource.getDiseaseImage(condition)
      .then(photos => {
        // var medias = _.map(photos , (photo:any , ix) => {
        //   return {
        //     ix: ix,
        //     isBase64: true,
        //     path: photo.filename,
        //     data: photo.fileData , 
        //     status: photo.filestatus
        //   };
        // });
        // var g = _.groupBy(medias , "status");
        // _.forEach(g , (v , key) => {
        //   this.oldMedias.push({name:key , medias:v});
        // });        
        _.each(photos, (photo: { fileData: string; filename: string; filestatus:string}, ix) => {
          this.oldMedias.push({
            ix: ix,
            isBase64: true,
            path: photo.filename,
            data: photo.fileData , 
            status: getStatus(photo.filestatus)
          });
        });
        this.oldMedias.sort((n1 , n2) => {
          return _.indexOf(status , n1.status) - _.indexOf(status , n2.status);
        });
        this.oldMediaLoading = false;
        return this.oldMedias;
      })
      .catch(err => {
        console.log(err);
      });
  }
}
