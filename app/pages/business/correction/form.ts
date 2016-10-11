import {Events, NavController, NavParams, ViewController, Alert, Loading, Modal, Toast , LocalStorage , Storage} from 'ionic-angular';
import {Component, ViewChild} from '@angular/core';
import {NgForm} from '@angular/common';
import {Geolocation} from 'ionic-native';
import * as _ from 'lodash';

import {AppConfig} from '../../../providers/app-config';
import {AppConstant} from '../../../providers/app-constant';
import {DatabaseService} from '../../../providers/database-service';
import {UserService} from '../../../providers/user-service';

import {BaseFormPage} from '../base/base-form';
import {CorrectionModel} from '../../../models/correction-model';


@Component({
  templateUrl: 'build/pages/business/correction/form.html'
})
export class CorrectionFormPage extends BaseFormPage<CorrectionModel>{

  /** storagae 获取天气,线路,方向信息 */
  private storage:any = new Storage(LocalStorage);
  private BASEINFOKEY = "CorrectionBaseinfo";
  /** 基础信息 天气,线路,方向 */
  private baseinfo:any = {};
  private hasBaseinfo = false;

  /** 天气 */
  private weathers = [];
  /** 道路 */
  private roads = [];
  /** 类别 */
  private catalogs: any[] = [];
  /** 巡查项目 */
  private subCatalogs: any[] = [];
  /** 整改期限 */
  private deadlines: any[] = [1,2,3,4,5,6,7,8,910,15,30,45,60];
  /** 整改方式 */
  private correctionTypes :any[] = ["派单" , "结案"];
  /** 扣分 */
  private fens: any[] = _.range(0,20.5,.5);
  /** 方向列表 , 从road中获取 */
  private directions: any[] = [];
  /** 车道列表 */
  private chedaoItems = [];
  /** 病害位置列表 */
  private zhuanghaoweizhiItems = [];

  constructor(
    events: Events,
    nav: NavController,
    navParams: NavParams,
    dbService: DatabaseService
  ) {
    super(events , nav , navParams , dbService);

    //获取本地数据, 之后读取数据
    this.storage.getJson(this.BASEINFOKEY).then(res => {
      if (res) this.baseinfo = res;
      //判断是否有完全的weather , road , direction
      if (this.baseinfo.jianchaUsername && this.baseinfo.highwayName && this.baseinfo.fangxiang){
        this.hasBaseinfo = true;        
        _.extend(this.result , this.baseinfo);
      }
    })
    .catch()
    .then(() => this.loadData());
  }

  /**读取数据 */
  loadData() {
    //this.getUnits();
    this.getWeathers();
    this.getRoads();
    this.getBinghaiweizhiItems();
    this.getChedaoItems();
    this.getCatalogs();
  }


  editBaseinfo(){
    this.hasBaseinfo = false;
  }
  /** 设置基础信息 */
  onBaseinfoChange(){
    var vs = {
      jianchaUsername:this.result.jianchaUsername ,
      highwayName:this.result.highwayName , 
      fangxiang:this.result.fangxiang
    };
    _.extend(this.baseinfo , vs);
    this.storage.setJson(this.BASEINFOKEY , this.baseinfo);
  }

  /** 获取天气 */
  getWeathers() {
    return Promise.resolve(AppConstant.Weathers)
      .then(items => {
        this.weathers = items;
        this.onBaseinfoChange();
        return items;
      });
  }

  /** 获取道路列表 */
  getRoads() {
    var sql = `select * from road where CompanyID = '${this.currentUser.companyId}'`;
    return this.dbService.query(sql)
      .then(items => {
        this.roads = items;
        return items;
      })
      .then(items => {
        if (!this.baseinfo.highwayName) this.result.highwayName = items.length > 0 ? items[0].totalRouteName : ""
        this.onRoadChange();
      });
  }
  /** 高速change事件 */
  onRoadChange() {
    var roadName = this.result.highwayName;
    var roadRecord = _.find(this.roads , {totalRouteName:roadName});
    this.onBaseinfoChange();
    this.result.fangxiang = "";
    this.getDirections(roadName);
  }
  /** 获取方向 */
  getDirections(roadName) {
    var roadRecord = _.find(this.roads, {totalRouteName: roadName });
    var directions = [];
    if (roadRecord) {
      directions.push(
        { text: "上行:" + roadRecord.UpLink, value: roadRecord.UpLink },
        { text: "下行:" + roadRecord.DownLink, value: roadRecord.DownLink }
      );
    }
    this.directions = directions;
    if (this.baseinfo.fangxiang){
      var direction = _.find(directions , {value:this.baseinfo.fangxiang});
      if (direction){
        this.result.fangxiang = this.baseinfo.fangxiang;
      }else{
        this.result.fangxiang = directions.length > 0 ? directions[0].value : "";
      }
    }else{
      this.result.fangxiang = directions.length > 0 ? directions[0].value : "";
    }
    //if (!this.baseinfo.fangxiang) 
    this.onBaseinfoChange();
  }

  /** 获取病害位置 */
  getBinghaiweizhiItems() {
    Promise.resolve([
      { id: 1, name: "道路桩号" } ,
      { id:6 , name:"联络线"} ,
      // { id: 2, name: "桥梁匝道" },
      { id: 3, name: "区间" },
      // { id: 4, name: "隧道" },
      { id: 5, name: "其他" }

    ])
      .then(items => {
        this.zhuanghaoweizhiItems = items;
        this.result.zhuanghaoweizhi = items[0].name;
      });
  }
  /** 获取车道列表 */
  getChedaoItems() {
    Promise.resolve(
      ["中央隔离带", "路缘带", "第1车道", "第2车道", "第3车道", "第4车道", "第5车道", "第6车道", "加速车道", "减速车道", "紧急停车带", "土肩带", "边坡", "排水沟", "其他"]
    )
      .then(items => {
        this.chedaoItems = items;
        //this.result.chedao = items[0];
      });
  }
  /** 获取catalogs 类别 */
  getCatalogs() {
    var sql = `select caseCatalog as name 
      from CorrectionCatalog 
      where caseCatalog != ''
      group by caseCatalog , catalogID
      order by catalogID`;
    this.dbService.query(sql)
      .then(items => {
        this.catalogs = items;
        this.result.caseCatalog = items.length > 0 ? items[0].name : "";
        this.onCatalogChange();
      });
  }
  //catalog change
  onCatalogChange() {
    var catalogName = this.result.caseCatalog;
    this.result.subCatalog = "";
    this.getSubCatalogsByCatalog(catalogName);
  }

  //获取subcatalog 巡查项目
  //@param string parentcatalog 分类名称
  getSubCatalogsByCatalog(catalog) {
    var sql = `select subCatalog as name from CorrectionCatalog 
      where subCatalog != '' and caseCatalog = '${catalog}'
      group by subCatalog , subCatalogID  order by subCatalogID`;
    this.dbService.query(sql)
      .then(items => {
        this.subCatalogs = items;
        this.result.subCatalog = items.length > 0 ? items[0].name : "";
      });
  }

}
