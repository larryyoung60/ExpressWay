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
export class CorrectionSyncService extends BaseSyncService {

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
    opt.type = "Correction";
    opt.tableName = "Local"+opt.type;  
    opt.hasDetail = false;
    opt.hasMedia = true;
    opt.mediaType = AppConstant.MediaType.Correction;
  }
  
  uploadRecord(record){
    return this.resource.saveCorrection(record);
  }
  
}