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

import {MaintainFormPage} from './form';
import {CommonDetailPage} from '../../common/detail/detail';
import {MaintainInfoPage} from './info';

import {MaintainModel} from '../../../models/maintain-model';
import {BaseTabsPage} from '../base/base-tabs';

@Component({
  templateUrl: 'build/pages/business/maintain/tabs.html'
})
export class MaintainTabsPage extends BaseTabsPage<MaintainModel> {

  public infoPage = MaintainInfoPage;
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
    super(events, nav, navParams , MaintainModel);
    var maintainItem = navParams.get("item");
    _.extend(this.result , maintainItem);   
    this.initResult();

    var detail = maintainItem.detail;
    _.each(detail , (n) => {
      this.detail.push(n);
    });
    this.mainPage = MaintainFormPage;
    this.detailPage = CommonDetailPage;
    _.extend(this.infoParams , {result:this.result});

    this.getOldMedias();
  }

  initResult(){
    let rs = <MaintainModel>this.result;
    rs.feedbackUser = this.currentUser.truename;
    rs.reportUserID = this.currentUser.id;
    rs.reportUsername = this.currentUser.truename;
    rs.FeedbackTime = moment().format("YYYY-MM-DD");
  }

  initPageOptions() {
    var opt = this.pageOptions;
    opt.type = "Maintain";
    opt.tableName = "Local" + opt.type;
    opt.modelFields = ["id", "AskFinsihedTime" , "FeedbackDesc" , "FeedbackTime" , "SendsingleUserName" , 
      "caseID" , "feedbackUser" , "fuzeUser" , "gongchengWeizhi" , "guanliDanwei" , "reportUserID" , 
      "reportUsername" , "routeName" , "weixiuDanwei" , "weixiuItem" , "yanghuXiangmu" , "stakeNum" , "xuhao"];

    opt.hasMedia = true;
    opt.mediaRequired = false;
    opt.mediaType = AppConstant.MediaType.Maintain;

    opt.hasDetail = true;
    opt.detailFields = ["id" , 	"localParentId" , "remoteParentId" ,"catalog" , "dealWith" , "gongchengL" , 
      "jiliangDesc" , "jiliangDescSave" , "jiliangUnit" , "parentCatalog" , "stakeNum" , "subName" , 
      "sunhuaiqingkuang" , "timelist" , "weixiuFangAn"];
    opt.detailRequired = true;
    opt.detailTableName = "localDiseaseDetail";

    opt.useCoords = false;

    opt.saveButtonText = "发送";
    opt.loadingContent = "保存维修日志";
  }

  getMainOptions(){
    return _.extend(super.getMainOptions() , {title:"维修日志"});
  }
  getDetailOptions(){
    return _.extend(super.getDetailOptions() , {title:"维修工程量"});
  }
  getMediaOptions(){
    return _.extend(super.getMediaOptions() , {title:"维修后照片" , oldTitle:"路巡上报照片"});
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
