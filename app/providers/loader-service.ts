import {Injectable} from '@angular/core';
import {Storage, LocalStorage, Events , Platform} from 'ionic-angular';
import * as _ from 'lodash';

import {AppVersions} from '../providers/app-versions';
import {DatabaseService} from '../providers/database-service';
import {Resource} from '../providers/resource';
import {SettingService} from '../providers/setting-service';
import {UserService} from '../providers/user-service';

import {Http} from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class LoaderService {

  private storage:any = new Storage(LocalStorage);
  private INSTALLED_KEY:string = "installed";
  private VERSION_KEY:string = "version";
  private tables:any = {};
  private oldVersion = "";

  constructor(
    private http:Http , 
    private events:Events , 
    private platform: Platform,    
    private resource:Resource, 
    private dbService:DatabaseService, 
    private settingService:SettingService , 
    private userService:UserService
  ) {
    
  }

  clear(){
    this.storage.remove(this.INSTALLED_KEY);
  }

  //检测是否已安装
  isInstalled() {
    return this.storage.get(this.INSTALLED_KEY);
  }

  /**安装 , 写入配置 , 写入安装标志 */
  install() {
    return this.settingService.setSetting()   //写入默认配置
      .then(() => this.setInstalled())        //写入已安装标志
  }

  setInstalled() {
    this.events.publish('loader:change', "安装成功");
    this.storage.set(this.INSTALLED_KEY, 1);
    return Promise.resolve();
  }


  /**判断是否是最新版本 */
  isNewVersion() {
    this.events.publish('loader:change', "检测版本信息");
    return this.storage.get(this.VERSION_KEY).then(version => {
      //if (!version) version = '0.0.1';
      this.oldVersion = version;
      return Promise.resolve(this.oldVersion == AppVersions.version);
    });
  }
  /**如果是新版本,进行更新 */
  update() {
    return this.getUpdateVersions()
      .then((versions) => this.batchUpdateVersions(versions))
      .then(() => this.setVersion())
  }

  /**获取更新的版本信息列表 */
  getUpdateVersions() {
    this.events.publish('loader:change', "获取更新列表");
    var startIndex = _.findIndex(AppVersions.versions, { version: this.oldVersion });
    var endIndex = _.findIndex(AppVersions.versions, { version: AppVersions.version });
    var updateVersions = _.filter(AppVersions.versions, (n, i) => {
      return i > startIndex && i <= endIndex;
    });
    return Promise.resolve(updateVersions);
  }

  /**执行所有需要更新的版本 */
  batchUpdateVersions(versions) {
    var me = this;
    function recordValue(results, value) {
      results.push(value);
      return results;
    }
    // [] 用来保存初始化值 , 如果不需要返回值,可以不用
    var pushValue = recordValue.bind(null, []);
    // 返回promise对象的函数的数组
    var tasks = _.map(versions, (version) => {
      return function () {
        return me.updateVersion(version);
      }
    });
    return tasks.reduce((promise: Promise<any>, task) => {
      return promise.then(task).then(pushValue);
    }, Promise.resolve());
  }

  /**执行单个版本 */
  updateVersion(version) {
    return this.getVersionSqls(version)
      .then(version => this.executeSql(version))
      .then(version => this.syncData(version));
  }

  /**获取要更新的SQL */
  getVersionSqls(version) {
    if (!version.sqlFile) return Promise.resolve(version);
    this.events.publish('loader:change', "更新版本" + version.version + ":读取数据库文件");
    return new Promise((resolve, reject) => {
      this.http.get("data/" + version.sqlFile)
        .map(res => {
          var sqlText = res.text();
          var sqls = [];
          _.each(sqlText.split(";"), function (n) {
            if (_.isEmpty(n)) return;
            if (!n.match(/./)) return;
            var sql = n.replace("identity(1,1)", "");
            sqls.push(sql)
          });
          version.sqls = sqls;
          return version;
        })
        .subscribe(
        res => resolve(res),
        err => reject(err.text ? err.text() : err)
        );
    });
  }

  //初始化数据库,创建表,返回promise
  executeSql(version) {
    let sqls = version.sqls;
    if (!sqls) return Promise.resolve(version);
    this.events.publish('loader:change', "更新版本" + version.version + ":初始化数据库");
    //console.log(sqls)
    return this.dbService.run(sqls)
      .then(() => { return version });
  }

  //同步所有数据
  syncData(version) {
    let _this = this, fns = [], syncs = version.syncs;
    if (!syncs) return Promise.resolve(version);
    this.events.publish('loader:change', "更新版本" + version.version + ":同步基础数据");
    _.each(syncs, function (code) {
      fns.push(_this.syncTable(code));
    });
    return Promise.all(fns);
  }
  //同步一个表
  syncTable(tableName) {
    return new Promise((resolve, reject) => {
      var resourceFn = this.resource[tableName.toLowerCase()];
      if (!resourceFn) {
        resolve();
        return;
      }
      this.resource[tableName.toLowerCase()]()
        .then(res => {
          var fields = [], sqls = [];
          sqls.push("delete from "+tableName);
          _.each(res[0], function (v, key, o) {
            if (key.indexOf("@") == -1) fields.push(key);
          });
          _.each(res, function (n) {
            var values = [];
            _.each(fields, function (field) {
              values.push("'" + (n[field] || "") + "'");
            });
            sqls.push("insert into " + tableName + " (" + fields.toString() + ") values (" + values.toString() + ");");
          });
          this.dbService.run(sqls)
            .then(() => {
              resolve();
            })
            .catch((err) => {
              reject(err);
            });
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  setVersion() {
    this.events.publish('loader:change', "更新成功");
    this.storage.set(this.VERSION_KEY, AppVersions.version);
    return Promise.resolve();
  }  
  
  start(){      
    return this.settingService.getSetting()        //读取程序配置
    .then(() => this.userService.checkLoggedIn())   //判断是否登录
  }

}

