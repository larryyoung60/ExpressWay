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
import {BaseSyncService} from './base-sync-service';


@Injectable()
export class MaintainSyncService extends BaseSyncService {

  constructor(
    http: Http,
    events: Events,
    dbService: DatabaseService,
    resource: Resource,
    settingService: SettingService,
    userService: UserService
  ) {
    super(http,events,dbService,resource,settingService,userService);
  }
  
  initSyncOptions(){
    var opt = this.syncOptions;
    opt.type = "Maintain";
    opt.tableName = "Local"+opt.type;  
    opt.hasMedia = true;
    opt.mediaType = AppConstant.MediaType.Maintain;
    opt.hasDetail = true;
    opt.detailTableName = "LocalDiseaseDetail";
  }
  
  /** 上传 , 返回值 为 true , false , 需要判断一下再返回一个promise */
  uploadRecord(record , detail){
    return new Promise((resolve , reject) => {
      this.resource.saveMaintainTask(record , detail)
        .then(res => {
          if (res.toString() === "true"){            
            resolve(record.caseID)
          }else{
            reject("保存维修任务失败!");
          }
        })
        .catch(err => reject(err));            
    });
  }
  
}