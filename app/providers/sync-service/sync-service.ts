import {Injectable, Inject} from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';
import {Storage, LocalStorage, Events} from 'ionic-angular';
import {LocalNotifications} from 'ionic-native';
import * as _ from 'lodash';

import {DatabaseService} from '../database-service';
import {NetworkService} from '../network-service';
import {Resource} from '../resource';
import {SettingService} from '../setting-service';
import {UserService} from '../user-service';

//其他子模块
import {DiseaseSyncService} from './disease-sync-service';
import {MaintainSyncService} from './maintain-sync-service';
import {AcceptanceSyncService} from './acceptance-sync-service';
import {CorrectionSyncService} from './correction-sync-service';
import {CorrectionReviewSyncService} from './correction-review-sync-service';
import {GpsTrackSyncService} from './gps-track-sync-service';


@Injectable()
export class SyncService {

  /** 同步源 */
  public sources: any[] = [
    { name: "巡查轨迹", code: "GpsTrack", service: this.gpsTrackSrv } ,
    { name: "路况巡查", code: "Disease", service: this.diseaseSrv },
    { name: "维修反馈", code: "Maintain", service: this.maintainSrv },
    { name: "监理验收", code: "Acceptance", service: this.acceptanceSrv },
    { name: "整改通知", code: "Correction", service: this.correctionSrv },
    { name: "整改复查", code: "CorrectionReview", service: this.correctionReviewSrv }
  ];

  public localDataRecordCount: number = 0;
  public currentTaskSource: any = {};

  constructor(
    private http: Http,
    private events: Events,
    private dbService: DatabaseService,
    private networkService: NetworkService,
    private resource: Resource,
    private settingService: SettingService,
    private userService: UserService,
    private diseaseSrv: DiseaseSyncService,
    private maintainSrv: MaintainSyncService,
    private acceptanceSrv: AcceptanceSyncService,
    private correctionSrv: CorrectionSyncService ,
    private correctionReviewSrv: CorrectionReviewSyncService ,
    private gpsTrackSrv: GpsTrackSyncService
  ) {

    this.sources.map(item => {
      item.records = [];
      item.status = "";
    });
  }
  initEvent() {
    this.events.subscribe('database:add', data => {
      var type = data[0], record = data[1];
      this.localDataRecordCount++;
      this.autoSync(type, record);
    });
    this.events.subscribe('sync:complete', () => {
      this.localDataRecordCount--;
      /*
      LocalNotifications.schedule({
        id: 1,
        text: "上传完毕!",
        led: "#FFFFFF"
      });
      */
    });
  }

  autoStart() {
    if (this.settingService.get("autoUpload") === true) this.start();
  }
  //启动同步任务
  start() {
    this.sources.map(source => this.sync(source.code));
  }

  autoSync(sourceCode, recordId) {
    if (this.settingService.get("autoUpload") === true) this.sync(sourceCode, recordId);
  }

  sync(sourceCode: string, recordId?: any) {
    //查看网络状态
    if (!this.networkService.allowUpload()) return;
    if (!sourceCode) return;
    var source = _.find(this.sources, { "code": sourceCode });
    if (!source) return;
    if (!source.service) return;
    var srv = source.service;
    if (recordId) {
      srv.sync(recordId);
    } else {
      srv.syncAll();
    }
  }

  /** 获取本地数据 */
  getLocalData() {
    var promiseFns = [];
    _.each(this.sources, (item, i) => {
      let srv = item.service;
      if (srv && srv.getRecords) {
        promiseFns.push(srv.getRecords());
      } else {
        promiseFns.push(Promise.resolve([]));
      }
    })
    return Promise.all(promiseFns).then(res => {
      res.map((rs, i) => this.updateSourceItem(rs, i));
      this.updateLocalDataRecordCount();
    })
      .catch(err => {
        console.log(err);
      });
  }
  updateSourceItem(records, i) {
    this.sources[i].records = records;
  }
  updateLocalDataRecordCount() {
    this.localDataRecordCount = _.sumBy(this.sources, (n) => { return n.records ? n.records.length : 0 })
    this.events.publish("database:refresh");
  }
}

