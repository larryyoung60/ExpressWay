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
import {DiseaseModel} from '../../../models/disease-model';


@Component({
  templateUrl: 'build/pages/business/disease/form.html'
})
export class DiseaseFormPage extends BaseFormPage<DiseaseModel>{

  /** storagae 获取天气,线路,方向信息 */
  private storage:any = new Storage(LocalStorage);
  private BASEINFOKEY = "DiseaseBaseinfo";
  /** 基础信息 天气,线路,方向 */
  private baseinfo:any = {};
  private hasBaseinfo = false;

  /** 天气 */
  private weathers = [];
  /** 道路 */
  private roads = [];
  /** 类别 */
  private catalogs: any[] = [];
  /** 分项名称 */
  private parentCatalogs: any[] = [];
  /** 巡查项目 */
  private subCatalogs: any[] = [];
  /** 损坏情况 */
  private dealwithItems: any[] = [];

  /** 方向列表 , 从road中获取 */
  private directions: any[] = [];
  /** 车道列表 */
  private chedaoItems = [];
  /** 病害位置列表 */
  private binghaiweizhiItems = [];

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
      if (this.baseinfo.others && this.baseinfo.routeName && this.baseinfo.fangxiang){
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
    var vs = {others:this.result.others , routeName:this.result.routeName , fangxiang:this.result.fangxiang};
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
        if (!this.baseinfo.routeName) this.result.routeName = items.length > 0 ? items[0].totalRouteName : ""
        //this.result.routeNum = items.length > 0 ? items[0].RouteNum : ""
        this.onRoadChange();
      });
  }
  /** 高速change事件 */
  onRoadChange() {
    var roadName = this.result.routeName;
    var roadRecord = _.find(this.roads , {totalRouteName:roadName});
    if (roadRecord){
      this.result.routeNum = roadRecord.RouteNum;
    }
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
        this.binghaiweizhiItems = items;
        this.result.binghaiweizhi = items[0].name;
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
    var sql = `select 
      catalog as name , catalogID as id 
      from Catalog 
      where catalog != ''
      group by catalog ,catalogID  order by catalogID`;
    this.dbService.query(sql)
      .then(items => {
        this.catalogs = items;
        this.result.catalog = items.length > 0 ? items[0].name : "";
        this.onCatalogChange();
      });
  }
  //catalog change
  onCatalogChange() {
    var catalogName = this.result.catalog;
    this.result.parentClg = "";
    this.result.subClg = "";
    this.result.dealwith = "";
    this.getParentCatalogsByCatalog(catalogName);
  }

  //获取parentcatalog 分类名称
  //@param string catalog 分类
  getParentCatalogsByCatalog(catalog) {
    var sql = `select 
      parentCatalog as name , pOrderID as id
      from Catalog 
      where parentCatalog != '' and catalog = '${catalog}'
      group by parentCatalog , pOrderID order by pOrderID`;
    this.dbService.query(sql)
      .then(items => {
        this.parentCatalogs = items;
        this.result.parentClg = items.length > 0 ? items[0].name : "";

        this.onParentCatalogChange();
      });
  }
  //parentcatalog change
  onParentCatalogChange() {
    var catalogName = this.result.catalog;
    var parentCatalogName = this.result.parentClg;
    this.result.subClg = "";
    this.result.dealwith = "";
    this.getSubCatalogsByParentCatalog(catalogName, parentCatalogName);
  }

  //获取subcatalog 巡查项目
  //@param string parentcatalog 分类名称
  getSubCatalogsByParentCatalog(catalog, parentCatalog) {
    var sql = `select 
      subName as name , sOrderID as id
      from Catalog 
      where subName != '' and catalog = '${catalog}' and parentCatalog = '${parentCatalog}'
      group by subName order by sOrderID`;
    this.dbService.query(sql)
      .then(items => {
        this.subCatalogs = items;
        this.result.subClg = items.length > 0 ? items[0].name : "";

        this.onSubCatalogChange();
      });
  }
  //subcatalog change
  onSubCatalogChange() {
    var catalogName = this.result.catalog;
    var parentcatalogName = this.result.parentClg;
    var subCatalogName = this.result.subClg;

    this.result.dealwith = "";
    this.getdealwithItemsBySubCatalog(catalogName, parentcatalogName, subCatalogName);
  }

  //获取dealwith 处理措施
  getdealwithItemsBySubCatalog(catalog, parentCatalog, subCatalog) {
    this.dbService.query(`select 
        dealWith as name , vOrderID as id
        from Catalog 
        where dealWith !='' and catalog = '${catalog}' and parentCatalog = '${parentCatalog}' and subName = '${subCatalog}' 
        group by dealWith , vOrderID order by vOrderID`
    )
      .then(items => {
        this.dealwithItems = items;
        this.result.dealwith = items.length > 0 ? items[0].name : "";
        this.onDealwithChange();
      });
  }

  /** dealwith change */
  onDealwithChange() {
    var catalogName = this.result.catalog;
    var parentcatalogName = this.result.parentClg;
    var subCatalogName = this.result.subClg;
    var dealwithName = this.result.dealwith;
    this.getDetail(catalogName, parentcatalogName, subCatalogName, dealwithName);
  }

  /**　获取工程量明细 */
  getDetail(catalog, parentCatalog, subCatalog, dealwith) {
    var sql = `select * from Catalog 
        where catalog = '${catalog}' and parentCatalog = '${parentCatalog}' and subName = '${subCatalog}' and dealWith = '${dealwith}'`;
    this.dbService.query(sql)
      .then(items => {
        this.events.publish("changedetail" , items);
      });
  }

  /** 桩号change event */
  onStakeChange(type , value){
    var stakeNum="";
    switch(type){
      case "k":
        this.result.stakeNumK1 = value;
        break;
      case "p":
        this.result.stakeNumP1 = value;
        break;
    }
    stakeNum = "K"+(this.result.stakeNumK1 || "0")+"+"+(this.result.stakeNumP1 || "000");
    //console.log(this.result.stakeNum , stakeNum)
    this.result.stakeNum = stakeNum;
    this.events.publish("changestakenum");
  }
}
