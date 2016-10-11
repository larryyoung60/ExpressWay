import {ionicBootstrap, App, Events, Platform, Nav, Toast} from 'ionic-angular';
import {Component} from '@angular/core';
import {StatusBar, Splashscreen, Network, Connection, Diagnostic} from 'ionic-native';
import {ViewChild} from '@angular/core';
import * as _ from 'lodash';
import {HttpService} from './pages/build/service/HttpService';
import {Detail} from './pages/build/dynamic/detail/Detail';
import {DyProject} from './pages/build/dynamic/project/DyProject';

//provider
import {AppConfig} from './providers/app-config';
import {AppConstant} from './providers/app-constant';
import {AppCommon} from './providers/app-common';
import {DatabaseService} from './providers/database-service';
import {LoaderService} from './providers/loader-service';
import {Resource} from './providers/resource';
import {SettingService} from './providers/setting-service';
import {NetworkService} from './providers/network-service'; 

import {GpsTrackService} from './providers/gps-track-service';
import {UserService} from './providers/user-service';


/** 负责同步 */
import {SyncService} from './providers/sync-service/sync-service';
import {DiseaseSyncService} from './providers/sync-service/disease-sync-service';
import {MaintainSyncService} from './providers/sync-service/maintain-sync-service';
import {AcceptanceSyncService} from './providers/sync-service/acceptance-sync-service';
import {CorrectionSyncService} from './providers/sync-service/correction-sync-service';
import {CorrectionReviewSyncService} from './providers/sync-service/correction-review-sync-service';
import {GpsTrackSyncService} from './providers/sync-service/gps-track-sync-service';

//pages
import {LoaderPage} from './pages/loader/loader';
import {LoginPage} from './pages/login/login';

@Component({
  templateUrl: 'build/app.html'
})
class MyApp {
  @ViewChild(Nav) nav: Nav;

  loggedIn: boolean = false;
  localDataRecordCount: number = 0;
  /** 初始页面 */
  rootPage: any = LoaderPage;
  //nav:any;
  user: any;

  constructor(
    private app: App,
    private events: Events,
    private platform: Platform,
    private networkService: NetworkService,
    private userService: UserService,
    private syncService: SyncService,
    private settingService: SettingService,
    private gpsTrackService: GpsTrackService
  ) {
    this.user = this.userService.current;
    //this.updateLocalDataRecordCount();
    //平台ready后初始化
    this.initializeApp();
    //事件监听
    this.eventListeners();
    console.log(new Date().getTime() - AppConstant.AppStartTime)
  }


  //初始化App
  initializeApp() {
    this.platform.ready().then(() => {
      let me = this;
      StatusBar.styleDefault();
      //Splashscreen.hide();
      this.settingService.getDeviceInfo();

      if (!this.platform.is("cordova")) return;
      //其他的cordova插件
      
      if (cordova.plugins && cordova.plugins.backgroundMode) {
        let bm = cordova.plugins.backgroundMode;
        bm.enable();
        bm.setDefaults({
          ticker: "系统后台运行中",
          title: "天津建交局",
          text: "没有任务运行!"
        });

        bm.onactivate = function () {
          var tasks = [];
          //采集GPS轨迹
          if (!me.gpsTrackService.getStatus()) {
            me.gpsTrackService.track();
            tasks.push("巡查轨迹");
          }
          var taskString = tasks.length == 0 ? "没有任务运行!" : "后台运行:" + tasks.toString();
          bm.configure({
            text: taskString
          });
        };
      }
      

    });
  }

  updateLocalDataRecordCount() {
    this.localDataRecordCount = this.syncService.localDataRecordCount;
  }

  /** 注册事件监听 */
  eventListeners() {
    //当添加数据后 , 更新本地记录数
    this.events.subscribe('database:add', () => {
      this.localDataRecordCount++;
    });
    this.events.subscribe("sync:complete", () => {
      this.localDataRecordCount--;
    });
    //当数据重新计算后 , 更新本地记录数
    this.events.subscribe('database:refresh', () => this.updateLocalDataRecordCount());
    /*
    //开始采集安保设施GPS估计
    this.events.subscribe("securitygpstrack:start", data => {
      var record = data[0];
      this.securityGpsTrackService.start(record);
    });
    */

    //用户登录成功后,更新
    this.events.subscribe('user:login', () => {
      this.loggedIn = true;
      this.user = this.userService.current;
      //开始执行动作
      //同步
      this.syncService.getLocalData();
      this.syncService.autoStart();
      this.syncService.initEvent();
      /*
      //开始记录轨迹    
      this.gpsTrackService.initAfterLogin();
      this.gpsTrackService.autoStart();
      */
    });
    //用户退出登录
    this.events.subscribe('user:logout', () => {
      this.loggedIn = false;
      this.user = {};
      //this.syncService.stop();
      //this.gpsTrackService.stop();
    });

    //http错误处理
    this.events.subscribe('httperror', (rs) => {
      let result = rs[0], response = rs[1];
      var message = "未知错误";
      if (result) {
        message = result.faultstring ? result.faultstring : result;
      }
      //if (response && reponse.s)
      //console.log(rs)
      let toast = Toast.create({
        message: message,
        duration: 1500,
        cssClass: "primary",
        showCloseButton: true,
        closeButtonText: "关闭"
      });
      this.nav.present(toast);
    });
  }

  //退出登录
  logout() {
    this.userService.logout();
    this.nav.setRoot(LoginPage);
  }
}

/** 启动app */
ionicBootstrap(MyApp, [
  AppConfig,
  AppConstant,
  AppCommon,
  DatabaseService,
  LoaderService,
  NetworkService,
  GpsTrackService,
  HttpService,
  UserService,
  SettingService,
  Resource,
  Detail,
  DyProject,
  SyncService,
  DiseaseSyncService,
  MaintainSyncService,
  AcceptanceSyncService,
  CorrectionSyncService ,
  CorrectionReviewSyncService ,
  GpsTrackSyncService
], {
    platforms: {
      ios: {
        backButtonText: "返回"
      }
    }
  });
