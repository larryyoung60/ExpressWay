import {Events, NavController, NavParams, Platform , ViewController, Alert, Loading, Modal, Toast} from 'ionic-angular';
import {Component} from '@angular/core';
import {Geolocation, Dialogs} from 'ionic-native';
import * as _ from 'lodash';
import * as moment from 'moment';

import {AppConfig} from '../../../providers/app-config';
import {AppCommon} from '../../../providers/app-common';
import {AppConstant} from '../../../providers/app-constant';
import {DatabaseService} from '../../../providers/database-service';
import {SettingService} from '../../../providers/setting-service';
import {HttpService} from '../service/HttpService';
import {BaseModel} from '../../../models/base-model';
import {UserInfoModel} from '../model/UserInfoModel'
import {PhotoAlbumModal} from '../../common/photo-album-modal/photo-album-modal'

export abstract class BasePage<T> {
  /** 当前登录用户信息 */
  protected currentUser: UserInfoModel = HttpService._currentUser;
  /** 表单内容 */
  protected result: T;
  protected cloneResult:T;
  /** 明细内容 */
  protected detail = [];
  /** 照片信息 */
  protected medias: any[] = [];
  /** 历史照片信息 */
  protected oldMedias: any[] = [];
  protected oldMediaLoading: boolean = false;
  protected weathers:any[]=[];
  protected units:any[]=[];
  protected roads:any[]=[];

  
  /** 获取到的要提交的内容 */
  protected submitedData: any = {};
  /** 页面相关参数 */
  protected pageOptions: BasePageOptions = {
    title: "",
    saveButtonText: "上报",
    type: "",
    tableName: "",
    modelFields: [],
    recordInvalidMessage: "内容填写错误,请检查是否有未填写的项目(蓝色标签的项为必填项)!",
    hasMedia: true,
    mediaType: "",
    mediaRequired: true,
    mediaInvalidMessage: "没有照片,请拍摄现场照片!",
    hasDetail: false,
    detailRequired: false,
    detailInvalidMessage: "没有明细记录,请添加!",
    detailFields: [],
    detailTableName: "",
    useCoords: false,
    coordsRequired: false,
    loadingContent: "保存数据"
  };
  /** 是否提交了表单 */
  protected isSubmited = false;




  protected settingService: SettingService;
  protected dbService: DatabaseService;

  /** 构造函数 */
  constructor(
    protected events: Events,
    protected nav: NavController,
    protected navParams: NavParams,
    ctor: NoParamConstructor<T>
  ) {
    this.settingService = new SettingService(events);
    this.dbService = new DatabaseService(events);

    /** 通过点击的按钮获取标题 */
    var fromMenu = navParams.get("menu");
    this.pageOptions.title = fromMenu ? fromMenu.text : "";

    this.result = new ctor();
    this.cloneResult = new ctor();
    //this.currentUser = this.userService.current;
    this.initResult();
    this.initPageOptions();
    this.loadData();
  }

  isFromIndex() {
    var isFromIndex = this.navParams.get("fromIndex") === true;
    delete this.navParams.data.fromIndex;
    return isFromIndex;
  }

  /** 初始化form result , 抽象方法 , 需要在子类中实现*/
  initResult() {

  }
  /** 初始化pageoptions , 抽象方法 , 需要在子类中实现*/
  abstract initPageOptions(): void


  /** 获取当前日期字符串 */
  getDateString(date: Date = new Date()) {
    return [
      date.getFullYear(),
      _.padStart((date.getMonth() + 1).toString(), 2, "0"),
      _.padStart(date.getDate().toString(), 2, "0")
    ].join("-");
  }

  /** 验证表单 */
  valid(form): SimpleResult {
    var rs = { isok: true };
    //验证表单
    var isFormValid = this.validRecord(form);
    isFormValid.type = "form";
    if (!isFormValid.isok) return isFormValid;

    //验证detail
    if (this.pageOptions.hasDetail) {
      var isDetailValid = this.validDetail();
      isDetailValid.type = "detail";
      if (!isDetailValid.isok) return isDetailValid;
    }

    //验证照片
    if (this.pageOptions.hasMedia) {
      var isMediaValid = this.validMedia();
      isMediaValid.type = "media";
      if (!isMediaValid.isok) return isMediaValid;
    }

    //可以做其他验证
    return rs;
  }
  afterInvalid(rs: SimpleResult) { }
  /** 验证主记录 */
  validRecord(form): SimpleResult {
    var rs: SimpleResult = { isok: true };
    if (!form.valid) {
      rs.isok = false;
      rs.message = this.pageOptions.recordInvalidMessage;
    }
    return rs;
  }

  /** 验证照片 */
  validMedia(): SimpleResult {
    var rs: SimpleResult = { isok: true };
    if (this.pageOptions.mediaRequired && this.medias.length == 0) {
      rs.isok = false;
      rs.message = this.pageOptions.mediaInvalidMessage;
    }
    return rs;
  }
  /** 验证明细 */
  validDetail(): SimpleResult {
    var rs: SimpleResult = { isok: true };
    if (this.pageOptions.detailRequired && this.detail.length == 0) {
      rs.isok = false;
      rs.message = this.pageOptions.detailInvalidMessage;
    }
    return rs;
  }

  /** 生成需要提交的数据 */
  setSubmitedData() {
    this.setRecordData();
    if (this.pageOptions.hasMedia) this.setMediaData();
    if (this.pageOptions.hasDetail) this.setDetailData();
  }
  /** 设置主记录信息 */
  setRecordData() {
    this.submitedData.record = this.result;
    //console.log(this.submitedData.record);
    this.submitedData.record.safe_id = AppCommon.newModelId();
  }
  /** 设置照片信息 */
  setMediaData() {
    var record = this.submitedData.record;
    //medias加parentId
    //fileName , itemId , reportUser , type , stake
    _.each(this.medias, (n, i) => {
      n.safe_id = record.safe_id + "-" + i;
      n.parentId = record.safe_id;
      var ext = _.last(n.path.split("."));
      //ext = "jpg"
      n.fileName = record.safe_id + "-" + this.currentUser._currentUser.user_id + "-" + n.ix + "." + ext;
      n.userID = this.currentUser._currentUser.user_id;
      n.type = this.pageOptions.mediaType;
      n.stakeNum = record.stakeNum;
      //n.reportTime = moment().format("YYYY-MM-DD HH:mm:ss") , 
      n.isUploaded = '0';
    });
    this.submitedData.medias = this.medias;
  }
  /** 设置明细数据 */
  setDetailData() {
    var record = this.submitedData.record;
    _.each(this.detail, (n, o) => {
      n.localParentId = record.safe_id;
    });
    this.submitedData.detail = this.detail;
  }

  /** 将获取到的GPS坐标值写入到已有数据 */
  setGeolocationInfo(geo): void {
    var record = this.submitedData.record;
    record.x = geo.coords.latitude;   //纬度
    record.y = geo.coords.longitude;  //经度
  }

  /** 取值并进行验证 */
  getValues(form) {
    //console.log(form);
    return new Promise((resolve, reject) => {
      //验证
      var isValid = this.valid(form);
      if (!isValid.isok) {
        //验证错误后执行动作
        this.afterInvalid(isValid);
        reject(isValid.message);
        return false;
      }
      //获取数据
      this.setSubmitedData();

      //获取GPS坐标
      if (!this.pageOptions.useCoords) {
        resolve();
        return false;
      }
      Geolocation.getCurrentPosition(AppConfig.gpsConfig)
        .then((res) => {
          this.setGeolocationInfo(res);
          resolve();
        })
        .catch(err => {
          //判断是否必须要XY坐标
          if (this.pageOptions.coordsRequired) {
            reject("获取位置信息发生错误 , " + err.message);
          } else {
            resolve();
          }
        });
    });
  }

  /** 获取要插入的SQL */
  getSqls(data: any): string[] {
    let sqls = [];
    //主记录SQL
    var mainSqls = this.getRecordSql(data);
    sqls = sqls.concat(mainSqls);
    //照片SQL
    if (this.pageOptions.hasMedia) {
      var mediaSqls = this.getMediaSqls(data);
      sqls = sqls.concat(mediaSqls);
    }
    //明细SQL
    if (this.pageOptions.hasDetail) {
      var detailSqls = this.getDetailSqls(data);
      sqls = sqls.concat(detailSqls);
    }
    //其他SQL需要扩展
    return sqls;
  }
  /** 获取主记录插入SQL */
  getRecordSql(data?: any): string | string[] {
    var record = data.record,
      tableName = this.pageOptions.tableName,
      fields = this.pageOptions.modelFields,
      values = [];
    _.each(fields, function (field) {
      values.push("'" + (record[field] || "") + "'");
    });
    let recordSql = "insert into " + tableName + " (" + fields.join(",") + ") values (" + values.join(",") + ");";
    return recordSql;
  }
  /** 获取照片插入SQL */
  getMediaSqls(data?: any): string[] {
    var medias = data.medias;
    var mediaSqls = [],
      fields = ["id", "parentId", "type", "ix", "fileName", "path", "userID", "stakeNum", "reportTime", "isUploaded"];
    //medias sql
    _.each(medias, function (media) {
      var values = [];
      _.each(fields, function (field) {
        values.push("'" + (media[field] || "") + "'");
      });
      var mediaSql = "insert into LocalDiseaseMedia (" + fields.join(",") + ") values (" + values.join(",") + ");";
      mediaSqls.push(mediaSql);
    });
    return mediaSqls;
  }
  /** 获取明细插入SQL */
  getDetailSqls(data: any): string[] {
    var detail = data.detail,
      fields = this.pageOptions.detailFields,
      tableName = this.pageOptions.detailTableName,
      detailSqls = [];
    //detail sql
    _.each(detail, function (item) {
      if (!item.id) item.id = AppCommon.newModelId();
      var values = [];
      _.each(fields, function (field) {
        values.push("'" + (item[field] || "") + "'");
      });
      var mediaSql = "insert into " + tableName + " (" + fields.join(",") + ") values (" + values.join(",") + ");";
      detailSqls.push(mediaSql);
    });
    return detailSqls;
  }

  /** 保存到数据库 */
  saveToDatabase(submitedData?: any) {
    var data = submitedData || this.submitedData;
    //获取需要插入到数据库的SQL
    var sqls: string[] = this.getSqls(data);
    //执行SQL语句
    return this.dbService.run(sqls);
  }

  getForm(form) {
    return form;
  }

  /** 保存数据到本地sqlite数据库 */
  save(form) {
    form = this.getForm(form);
    this.isSubmited = true;

    let loading = Loading.create({
      content: this.pageOptions.loadingContent,
      dismissOnPageChange: true
    });

    this.confirmSave()
      .then( () => this.nav.present(loading))   //显示Loading
      .then(() => this.getValues(form))         //获取值
      .then(() => console.log(this.submitedData))
      .then(() => this.saveToDatabase())        //保存到数据库
      .then(() => loading.dismiss())            //隐藏Loading
      .then(() => {
        var successMessage = "保存成功!" + (this.settingService.get("autoUpload") === true ? "数据将在后台自动上传." : "可以到本地数据中查看那并上传数据.");
        let toast = Toast.create({
          message: successMessage,
          duration: 2000,
          cssClass: "toast-success"
        });
        this.nav.present(toast);

        this.afterSave();

        return Dialogs.alert(
          successMessage ,
          "成功",
          "确认"
        ).then(btn => {
          //保存后执行动作
        });
      })
      .catch(err => {
        if (!err) return;
        if (loading){
          loading.dismiss().then(() => {
            let alert = Alert.create({ title: '错误', subTitle: err, buttons: ["确定"] });
            this.nav.present(alert);
          });
        }
      });
  }

  confirmSave(){
    return new Promise((resolve , reject) => {
      var confirm = Alert.create({
        title: '保存确认',
        message: "确定要保存" + (this.pageOptions.title || "当前") + "信息么?",
        buttons: [
          {text: '取消',role: 'cancel' , handler:()=>{
            reject();
          }},
          {text: '确认保存',handler: () => {
            resolve();
          }}
        ]
      });
      this.nav.present(confirm);
    })

    // return Dialogs.confirm(
    //   "确定要保存" + (this.pageOptions.title || "当前信息") + "么?",
    //   "保存确认",
    //   ["取消", "确认保存"]
    // ).then(btn => {
    //   if (btn == 1){
    //     return Promise.resolve();
    //   }else{
    //     return Promise.reject("");
    //   }
    // });
  }

  /** 保存成功后执行的动作 */
  afterSave() {
    this.events.publish('database:add', this.pageOptions.type, _.clone(this.submitedData.record));
    this.reset();
    //this.nav.pop();
    //this.events.publish("returntoindex");
  }

  /** 打开照片选择框 */
  openPhotoModal() {
    var mediaParams = this.getMediaParams();
    this.nav.push(PhotoAlbumModal, mediaParams);
  }

  getMediaParams() {
    var options = this.getMediaOptions();
    var params = _.extend(options, { medias: this.medias, result: this.result, nav: this.nav });
    return params;
  }

  /** 获取打开照片选择框的选项 */
  getMediaOptions(): Object {
    return {
      title: "照片影音记录",
      icon: "images",
      badgeStyle: "danger",
      oldTitle: "历史照片",
      oldMedias: this.oldMedias
    };
  }

  /** 获取Detail传递的参数 */
  getDetailParams() {
    var options = this.getDetailOptions();
    var params = _.extend(options, { detail: this.detail, result: this.result, nav: this.nav });
    return params;
  }

  /** 获取detail自定义项 */
  getDetailOptions() {
    return {
      title: "施工明细",
      icon: "construct",
      badgeStyle: "danger",
      /** 启用checkox */
      enableCheckbox: false,
      /** 启用滑动Item */
      enableSliding: true
    };
  }


  /** 复位 */
  reset() {
    _.extend(this.result , this.cloneResult);
    //删除原有数据
    this.detail.splice(0 , this.detail.length);
    this.medias.splice(0 , this.medias.length);
    this.oldMedias.splice(0 , this.oldMedias.length);
    this.submitedData = {};
    this.isSubmited = false;
  }

  /** 获取天气 */
  getWeathers() {
    return Promise.resolve(AppConstant.Weathers)
      .then(items => {
        this.weathers = items;
        return items;
      });
  }
  /** 获取单位 */
  getUnits() {
    var sql = `select jiliangUnit as name from Catalog where jiliangUnit != '' group by jiliangUnit order by jiliangUnit`;
    return this.dbService.query(sql)
      .then(items => {
        this.units = items;
        return items;
      });
  }
  /** 获取线路 */
  getRoads() {
    return this.dbService.query("select * from road where loc_id = ? ", [this.currentUser._currentUser.loc_id])
      .then(items => {
        this.roads = items;
        return items;
      });
  }
  /** 初始加载数据 */
  loadData() {
    this.getUnits();
    this.getWeathers();
    this.getRoads();
  }
}
