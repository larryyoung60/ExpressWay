import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';
import {Storage, LocalStorage, Events} from 'ionic-angular';
import * as _ from 'lodash';

import {AppConfig} from '../app-config';
import {AppConstant} from '../app-constant';
import {DatabaseService} from '../database-service';
import {Resource} from '../resource';
import {SettingService} from '../setting-service';
import {UserService} from '../user-service';

export abstract class BaseSyncService {

  //当前的进程记录
  protected threads: any[] = [];
  //当前同步配置
  protected syncOptions: BaseSyncOptions = {
    type: "",
    tableName: "",
    hasMedia: false,
    mediaType: "",
    hasDetail: false,
    detailTableName: ""
  };

  constructor(
    protected http: Http,
    protected events: Events,
    protected dbService: DatabaseService,
    protected resource: Resource,
    protected settingService: SettingService,
    protected userService: UserService
  ) {
    this.initSyncOptions();
  }
  /** 设置同步配置 */
  abstract initSyncOptions(): void

  /** 获取当前主记录对应的表名 */
  getTableName() {
    return this.syncOptions.tableName;
  }

  /** 获取数据库中记录 */
  getRecords() {
    return this.dbService.query("select * from " + this.getTableName() + " order by id desc");
  }

  /** 同步所有记录 */
  syncAll() {
    var maxUploadThread = this.settingService.get("maxUploadThread");
    var runningRecordsCount = this.getRunningRecords().length;
    if (runningRecordsCount >= maxUploadThread) return;
    var threadIds = this.getThreadIds();
    var limit = maxUploadThread - runningRecordsCount;
    var sql = "select * from " + this.getTableName() + " where id not in (" + threadIds + ") order by id limit " + limit;
    this.dbService.query(sql)
      .then(rs => {
        _.each(rs, (r) => this.sync(r));
      })
      .catch(err => {
        console.log(err, sql)
        //this.catchSync("sqlError" , err)
      });
  }

  /** 
   * 开始执行同步 
   * @params record
   */
  sync(record?: any) {
    //判断当前运行的进程数
    if (!this.allowSync()) return;
    this.getRecord(record)                          //通过record获取主记录
      .then(record => this.checkRecord(record))     //检查主记录是否在进程中
      .then(record => this.syncRecord(record))      //上传主记录
      .then(record => this.syncExt(record))         //上传所有其他非主记录,照片的记录
      .then(record => this.getMedias(record))       //获取照片
      .then(syncData => this.syncMedia(syncData))   //上传照片
      .then(record => this.removeRecord(record))    //删除本地数据库中的记录
      .then(record => this.complete(record))        //完成处理
      .then(() => this.sync())                      //重新执行
      .catch(errCode => this.catchSync(errCode));   //错误处理
  }

  /** 错误处理 */
  catchSync(err) {
    var error = { code: "", msg: "", record: null };
    if (_.isString(err)) {
      error.code = err.message || err;
    } else if (_.isError(err)) {
      console.log(err)
      error.code = "typeError";
      error.msg = err.message;
    } else {
      _.assign(error, err);
    }
    console.log("catchsync error - "+error.code + ":" + error.msg)

    switch (error.code) {
      case "noRecord":
        this.reset();
        break;
      case "inThread":
        this.sync();
        break;
      case "sqlError":
        this.sync();
        break;
      case "uploadRecord":
        this.sync();
        break;
      case "uploadMedia":
        this.sync();
        break;
      default:
        this.sync();
        break;
    }
  }

  /** 获取主记录 */
  getRecord(record) {
    //如果传入参数是object,直接返回,进行下一步
    if (_.isObject(record)) {
      return Promise.resolve(record);
    }
    var threadIds = this.getThreadIds();
    var sql = "select * from " + this.getTableName() + " where id not in (" + threadIds + ") ";
    if (record) {
      sql += " and id = " + record;
    }
    sql += " order by id limit 1";
    return new Promise((resolve, reject) => {
      return this.dbService.find(sql).then(r => {
        if (!r) {
          reject("noRecord");
        } else {
          resolve(_.clone(r));
        }
      });
    });
  }

  /** 
   * 判断记录是否可以上传 
   * 查看是否在进程中 , 如果在,返回错误 , 否则到下一步进行上传
   */
  checkRecord(record) {
    if (this.inThread(record)) {
      return Promise.reject({ code: "inThread", record: record });
    } else {
      this.addThread(record);
      return Promise.resolve(record);
    }
  }

  /** 上传主记录到服务器 */
  syncRecord(record) {
    //通过是否有remoteId判断主记录是否已上传 , 如果上传过 , 直接返回 , 进入下一步
    if (record && !_.isEmpty(record.remoteId)) {
      return Promise.resolve(record);
    }
    //如果没有上传过 , 上传
    return new Promise((resolve, reject) => {
      //上传到服务器
      //获取明细
      this.getDetail(record)
        .then(detail => this.uploadRecord(record, detail))
        .then(remoteId => {
          //上传成功 , 更新本地数据库中remoteId
          var sqls = this.getUpdateRemoteIdSql(record, remoteId);
          this.dbService.run(sqls)
            .then(() => {
              record.remoteId = remoteId; //记录ID
              resolve(record);
            })
            .catch((err) => {
              reject({ code: "sqlError", msg: "update remoteId:" + err, record: record });
            });
        })
        .catch(err => {
          reject({ code: "uploadRecord", msg: err, record: record });
        });
    });
  }

  /** 获取明细记录 */
  getDetail(record): Promise<any> {
    if (!this.syncOptions.hasDetail) return Promise.resolve();
    var detailTableName = this.syncOptions.detailTableName;
    return this.dbService.query("select * from " + detailTableName + " where localParentId = ?", [record.id]);
  }

  /** 获取上传主记录成功或更新其他记录remoteId的sql */
  getUpdateRemoteIdSql(record , remoteId):string[] {
      var tableName = this.getTableName(),
          hasMedia = this.syncOptions.hasMedia,
          mediaType = this.syncOptions.mediaType,
          hasDetail = this.syncOptions.hasDetail,
          detailTableName = this.syncOptions.detailTableName;
    var sqls = [
      `update ${tableName} set remoteId = '${remoteId}' where id = '${record.id}';`
    ];
    if (hasDetail) {
      sqls.push(`update ${detailTableName} set remoteParentId = '${remoteId}' where localParentId = '${record.id}';`);
    }
    if (hasMedia) {
      sqls.push(`update LocalDiseaseMedia set remoteParentId = '${remoteId}' where parentId = '${record.id}' and type = '${mediaType}';`);
    }
    return sqls;
  }

  /** 通过resource发送上传到wcf */
  abstract uploadRecord(record, detail?): Promise<any>

  /** 上传其他内容 */
  syncExt(record): Promise<any> {
    return Promise.resolve(record);
  }

  /** 获取照片记录 */
  getMedias(record) {
    if (!this.syncOptions.hasMedia) return Promise.resolve(record);
    //this.dbService.query("select * from LocalDiseaseMedia").then(res=>console.log(res))
    var mediaType = this.syncOptions.mediaType;
    var sql = `select * from LocalDiseaseMedia 
              where parentId='${record.id}' and isUploaded != '1' and type = '${mediaType}' 
              order by ix`;
    return this.dbService.query(sql)
      .then(medias => {
        return { record: record, medias: medias };
      })
      .catch(err => {
        console.log(err.err)
      });
  }

  /** 开始执行上传照片 */
  syncMedia(syncData) {
    if (!this.syncOptions.hasMedia) return Promise.resolve(syncData);
    var record = syncData.record, medias = syncData.medias;
    //如果没有照片
    if (medias.length == 0) {
      return Promise.resolve(record);
    }
    var promiseFns = [];
    _.each(medias, media => {
      if (!media.remoteParentId) media.remoteParentId = record.remoteId;
      promiseFns.push(this.uploadMedia(media, record));
    });
    return new Promise((resolve, reject) => {
      return Promise.all(promiseFns)
        .then(res => {
          resolve(record);
        })
        .catch(err => {
          //console.log("uploadmedia error:" + err);
          reject(err);
        })
    });
  }
  /** 上传单个文件到服务器 */
  uploadMedia(media, record): Promise<any> {
    var _this = this;
    return new Promise((resolve, reject) => {
      var ft = new FileTransfer();

      //设置上传参数
      var uploadOptions: FileUploadOptions = {};
      uploadOptions.params = {
        "notBinary": 1 //不上传二进制
      };
      uploadOptions.headers = {
        "filename": media.fileName,
        "caseID": media.remoteParentId,
        "userID": media.userID,
        "reportTime": media.reportTime,
        "type": media.type,
        "stakeNum": media.stakeNum
      };
      console.log(uploadOptions.headers);
      ft.upload(
        media.path,
        encodeURI(AppConfig.uploadUrl),
        //success callback
        function (response) {
          //ok , noOK
          var isok = response.response == "ok";
          if (!isok) {
            //上传不成功
            reject({ code: "uploadMedia", msg: response.response, record: record });
          } else {
            //上传照片成功 , 更新数据库isUploaded = 1
            _this.dbService
              .run("update LocalDiseaseMedia set isUploaded = '1' where id = '" + media.id + "'")
              .then(() => resolve())
              .catch(err => reject({ code: 'sqlError', msg: err }))
          }
        },
        //error callback
        function (err) {
          reject({ code: "uploadMedia", msg: err.exception, record: record });
        },
        uploadOptions
      );
    });
  }

  /** 删除本地数据库中的记录 */
  removeRecord(record) {
    return new Promise((resolve, reject) => {
      //获取删除的SQL
      var sqls = this.getRemoveSql(record);
      //执行删除
      this.dbService.run(sqls)
        .then(() => {
          record.isComplete = true;
          record.isRunning = 0;
          resolve(record);
        })
        .catch(err => {
          reject({ code: "removeRecord", msg: err, record: record });
        });
    });
  }
  
  /** 获取删除的SQL */
  getRemoveSql(record):string[]{    
      var tableName = this.getTableName(),
          hasMedia = this.syncOptions.hasMedia,
          mediaType = this.syncOptions.mediaType,
          hasDetail = this.syncOptions.hasDetail,
          detailTableName = this.syncOptions.detailTableName;    
      var sqls = [
        `delete from ${tableName} where id = '${record.id}';`
      ];
      if (hasDetail) {
        sqls.push(`delete from ${detailTableName} where localParentId = '${record.id}';`);
      }
      if (hasMedia) {
        sqls.push(`delete from LocalDiseaseMedia where parentId = '${record.id}' and type = '${mediaType}';`);
      }        
      return sqls;
  }  

  /** 一条记录同步完成 */
  complete(record: any) {
    this.events.publish("sync:complete", this.syncOptions.type, record);
  }

  /** 获取当前运行的进程数 , 通过running = 1判断 */
  getRunningRecords() {
    return _.filter(this.threads, { 'isRunning': 1 });
  }

  /** 是否允许同步 , 判断当前运行书是否超过限制 */
  allowSync() {
    var maxUploadThread = this.settingService.get("maxUploadThread");
    if (!maxUploadThread) {
      setTimeout(() => this.sync(), 500);
    }
    return this.getRunningRecords().length < maxUploadThread;
  }

  /** 复位threads */
  reset() {

  }

  /** 获取当前在进程中的记录id */
  getThreadIds(): any[] {
    return _.map(this.threads, (n)=>{
      return "'"+n.id+"'";
    })
  }
  /** 判断记录已在进程中 */
  inThread(record) {
    return _.findIndex(this.threads, { "id": record.id }) > -1;

  }
  /** 将一条记录加入到进程中 */
  addThread(record) {
    record.isRunning = 1;
    this.threads.push(record);
    return record;
  }

}

