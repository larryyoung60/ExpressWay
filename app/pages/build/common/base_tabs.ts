import {Events, NavController, NavParams , Tabs , ViewController, Alert, Loading, Modal, Toast} from 'ionic-angular';
import {Component , ViewChild} from '@angular/core';
import {NgForm} from '@angular/common';
import {Geolocation} from 'ionic-native';
import * as _ from 'lodash';

import {AppConfig} from '../../../providers/app-config';
import {AppCommon} from '../../../providers/app-common';
import {AppConstant} from '../../../providers/app-constant';
import {DatabaseService} from '../../../providers/database-service';
import {SettingService} from '../../../providers/setting-service';
import {UserService} from '../../../providers/user-service';
import {Resource} from '../../../providers/resource';

import {BaseModel} from '../../../models/base-model';
import {BasePage} from '../common/base';

import {PhotoAlbumModal} from '../../common/photo-album-modal/photo-album-modal'

export abstract class BaseTabsPage<T> extends BasePage<T> {

  @ViewChild(Tabs) tabRef: Tabs;

  /** 主页面 */
  protected mainPage: any;
  protected mainForm:NgForm;
  /** 主页面参数 */
  protected mainParams: any;
  /** 照片视频页面 */
  protected mediaPage: any;
  /** 照片视频页面参数 */
  protected mediaParams: any;
  /** 工程量明细页面*/
  protected detailPage: any;
  /** 工程量明细页面参数 */
  protected detailParams: any;

  protected tabsIndex = ["form" , "detail" , "media"];

  /** 构造函数 */
  constructor(
    protected events: Events,
    protected nav: NavController,
    protected navParams: NavParams ,
    ctor: NoParamConstructor<T>
  ) {
    super(events , nav , navParams , ctor);
    this.mediaPage = PhotoAlbumModal;
    this.mediaParams = this.getMediaParams();
    this.mainParams = this.getMainParams();
    this.detailParams = this.getDetailParams();

    this.events.subscribe("getform", res => {
      this.mainForm = res[0];
    });
  }

  
  afterInvalid(rs:SimpleResult){
    var ix = _.indexOf(this.tabsIndex , rs.type);
    //console.log(ix)
    if (ix>-1) this.tabRef.select(ix);
  }
  /**　获取MainForm */
  getForm(){
    return this.mainForm;
  }
  /** 获取mainForm参数 */
  getMainParams(){
    var options = this.getMainOptions();
    var params = _.extend(options , {result:this.result , nav:this.nav});
    return params;
  }

  getMainOptions(){
    return {
      title:"基础信息" ,
      icon:"book"
    }
  }
}
