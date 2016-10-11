import {NavController, NavParams, ViewController, Alert} from 'ionic-angular';
import {Component} from '@angular/core';
import {AppCommon} from '../../../providers/app-common';
import {CommonDetailModel} from '../../../models/common-detail-model';

import {DatabaseService} from '../../../providers/database-service';

@Component({
  templateUrl: 'build/pages/common/detail/form.html',
})
export class CommonDetailFormPage {
  /** 是否提交 */
  isSubmited = false;
  /** 父级Items*/
  parentItems: CommonDetailModel[];
  /** 传递过来的Item */
  item: CommonDetailModel;
  /** 表单值 */
  result: CommonDetailModel;
  /** 标题 */
  title: string;

  /**  */
  currentJiliangRecord = {};
  jiliangOptions = {
    width: false, widthRequired: false,
    length: false, lengthRequired: false,
    height: false, heightRequired: false,
    quantity: false, quantityRequired: false
  };

  isEditing = false;

  /** 类别 */
  catalogs: any[] = [];
  /** 维修方案(养护项目) */
  solutions: any[] = [];

  constructor(
    private nav: NavController,
    private navParams: NavParams,
    private viewCtrl: ViewController,
    private dbService: DatabaseService
  ) {
    this.title = this.navParams.get("title");
    this.isEditing = this.navParams.get("isEditing");
    this.parentItems = this.navParams.get("items");
    this.item = this.navParams.get("item");
    /** clone一个新Item */
    this.result = _.clone(this.item);

    //设置
    this.result.length = this.result.length || 1;
    this.result.width = this.result.width || 1;
    this.result.height = this.result.height || 10;
    if (!this.result.stakeNum || this.result.stakeNum == "K0+000") {
      this.result.stakeNum = "K0+000";
      this.result.stakeNumK1 = "";
      this.result.stakeNumP1 = "";
    } else {
      var stakeNum = this.result.stakeNum.replace("K", "").split("+");
      this.result.stakeNumK1 = stakeNum[0];
      this.result.stakeNumP1 = stakeNum[1];
    }

    if (this.isEditing) {
      this.setJiliangOptions();
    } else {
      this.loadData();
    }
  }

  /** 保存值 */
  save(form) {
    this.isSubmited = true;
    if (!form.valid) {
      let alert = Alert.create({ title: '错误', subTitle: "信息填写错误,请检查!", buttons: ["确定"] });
      this.nav.present(alert);
      return;
    }
    _.extend(this.item, this.result);
    //设置Ischecked      
    this.item.isChecked = true;
    //设置ID
    if (!this.item.id) this.item.id = AppCommon.newModelId();
    //添加的话插入
    if (!this.isEditing){
      this.parentItems.push(this.item);
    }
    this.viewCtrl.dismiss();
  }
  /** 关闭Model */
  close() {
    this.viewCtrl.dismiss();
  }

  /** 读取数据 */
  loadData() {
    this.getCatalogs();
  }

  /** 获取catalogs 类别 */
  getCatalogs() {
    var sql = `select catalog as name 
      from Catalog 
      where catalog != ''
      group by catalog , catalogID order by catalogID`;
    this.dbService.query(sql)
      .then(items => {
        this.catalogs = items;
        if (!this.result.catalog) this.result.catalog = items.length > 0 ? items[0].name : "";
        this.onCatalogChange();
      });
  }
  //catalog change
  onCatalogChange() {
    var catalogName = this.result.catalog;
    this.result.parentCatalog = "";
    this.result.subName = "";
    this.result.dealWith = "";
    this.result.weixiuFangAn = "";
    this.getSolutions(catalogName);
  }
  //获取 solution 维修方案
  getSolutions(catalog) {
    var sql = `select weixiuFangAn as name , jiliangDesc , jiliangUnit from Catalog 
      where weixiuFangAn != '' and catalog = '${catalog}'
      group by weixiuFangAn , jiliangDesc , jiliangUnit order by name`;
    this.dbService.query(sql)
      .then(items => {
        this.solutions = items;
        if (!this.result.weixiuFangAn) this.result.weixiuFangAn = items.length > 0 ? items[0].name : "";
        this.onSolutionChange();
      });
  }
  //solution change
  onSolutionChange() {
    var catalogName = this.result.catalog;
    var solutionName = this.result.weixiuFangAn;
    //查询对应的记录
    var sql = `select * from catalog 
      where catalog = '${catalogName}' and weixiuFangAn = '${solutionName}'
      group by weixiuFangAn , jiliangDesc , jiliangUnit`;
    this.dbService.query(sql)
      .then(items => {
        var item = items[0] || {};
        _.extend(this.result, item);
        this.setJiliangOptions();
      });
  }
  setJiliangOptions() {
    this.changeValues();
    var opt = this.jiliangOptions;
    _.each(opt, (n, key) => {
      opt[key] = false;
    });
    var desc = this.result.jiliangDesc || "", unit = this.result.jiliangUnit || "";
    if (desc.search(/^\([\d|.]+ m×[\d|.]+ m×[\d|.]+ cm\)$/) > -1) {
      opt.width = true;
      opt.widthRequired = true;
      opt.length = true;
      opt.lengthRequired = true;
      opt.height = true;
      opt.heightRequired = unit === "m3";
    } else if (desc.search(/^\([\d|.]+ m×[\d|.]+ m\)$/) > -1) {
      opt.width = true;
      opt.widthRequired = true;
      opt.length = true;
      opt.lengthRequired = true;
    } else if (desc == "") {
      opt.quantity = true;
      opt.quantityRequired = true;
    }
  }


  onInputChange() {
    this.changeValues();
  }

  changeValues() {
    var rs = this.result;
    //处理桩号
    rs.stakeNum = "K" + (rs.stakeNumK1 || "0") + "+" + (rs.stakeNumP1 || "000");
    //处理工程量
    var jiliangDesc = rs.jiliangDesc || "", unit = rs.jiliangUnit || "";
    var desc = "" , saveDesc = "";
    if (jiliangDesc.search(/^\([\d|.]+ m×[\d|.]+ m×[\d|.]+ cm\)$/) > -1) {
      if (unit == "m3") {
        rs.gongchengL = (rs.length * rs.width * (rs.height/100)).toString();
        desc = `(${rs.length} m×${rs.width} m×${rs.height} cm)`;
        saveDesc = `长度(m): ${rs.length},m,宽度(m):${rs.width},m,厚度(cm):${rs.height},cm工程量: ${rs.gongchengL},${rs.jiliangUnit}`;	
      } else if (unit == "㎡") {
        desc = `(${rs.length} m×${rs.width} m)`;
        rs.gongchengL = (rs.length * rs.width).toString();
        saveDesc = `长度(m):${rs.length},m,宽度(m):${rs.width},m,工程量:${rs.gongchengL},${rs.jiliangUnit}`;	
      }
    } else if (jiliangDesc.search(/^\([\d|.]+ m×[\d|.]+ m\)$/) > -1) {
        rs.gongchengL = (rs.length * rs.width).toString();        
        desc = `(${rs.length} m×${rs.width} m)`;
        saveDesc = `长度(m):${rs.length},m,宽度(m):${rs.width},m,工程量:${rs.gongchengL},${rs.jiliangUnit}`;
    } else if (jiliangDesc == "") {
        saveDesc = `工程量:${rs.gongchengL},${rs.jiliangUnit}`;
        //saveDesc = `工程量：${rs.gongchengL},${rs.jiliangUnit}`;
    }
    rs.jiliangDescSave = saveDesc;
    rs.jiliangDesc = desc;

  }



}
