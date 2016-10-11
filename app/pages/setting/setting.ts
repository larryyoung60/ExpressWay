import {NavController, Loading , Toast} from 'ionic-angular';
import {Component} from '@angular/core';
import * as _ from 'lodash';


import {AppVersions} from '../../providers/app-versions';
import {LoaderService} from '../../providers/loader-service';
import {SettingService} from '../../providers/setting-service';
import {UserService} from '../../providers/user-service';
import {SyncService} from '../../providers/sync-service/sync-service';

import {LoginPage} from '../login/login';
import {LocaldataPage} from '../localdata/localdata'

@Component({
  templateUrl: 'build/pages/setting/setting.html',
})
export class SettingPage {

  setting: any;
  userInfo: any;
  private photoQualities: number[] = [100, 90, 80, 70, 60, 50, 40, 30];
  private threadCounts: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  private photoSizes: any[] = [
    { value: "1000x1780", note: "1000x1780,320K,@Custom" },
    { value: "2896x5152", note: "2896x5152,5M,@1" },
    { value: "2317x4122", note: "2317x4122,2.1M,@0.8" },
    //{value:"2028x3607" , note:"2028x3607,1.6M,@0.7"} ,
    { value: "1738x3092", note: "1738x3092,1.1M,@0.6" },
    //{value:"1448x2576" , note:"1448x2576,730K,@0.5"} ,
    { value: "1159x2061", note: "1159x2061,450K,@0.4" },
    { value: "869x1546", note: "869x1546,250K,@0.3" },
    { value: "580x1031", note: "580x1031,120K,@0.2" }
  ];
  private gpsTrackStartTypes: any[] = [
    { value: "manual", note: "手动开启" },
    { value: "auto", note: "自动开启" }
  ];
  private gpsTrackTimes: any[] = [
    { value: 5, note: "5秒" },
    { value: 10, note: "10秒" },
    { value: 20, note: "20秒" },
    { value: 30, note: "30秒" },
    { value: 60, note: "1分钟" },
    { value: 120, note: "2分钟" },
    { value: 180, note: "3分钟" },
    { value: 300, note: "5分钟" },
    { value: 600, note: "10分钟" },
    { value: 900, note: "15分钟" }
  ];
  private localDataRecordCount: number;

  constructor(
    private nav: NavController,
    private loaderService: LoaderService,
    private settingService: SettingService,
    private syncService: SyncService,
    private userService: UserService
  ) {
    this.setting = settingService.setting;
    this.userInfo = userService.current;
    this.localDataRecordCount = this.syncService.localDataRecordCount;
  }
  changeSetting() {
    this.settingService.setSetting();
  }
  viewLoacalData() {
    this.nav.push(LocaldataPage);
  }
  checkVersion() {

  }
  /**更新基础数据 */
  updateBaseinfo() {
    var versions = _.map(AppVersions.versions, (n) => {
      return { syncs: n.syncs };
    });
    let loading = this.createLoading("更新基础数据");
    this.nav.present(loading)
      .then(() => this.loaderService.batchUpdateVersions(versions))
      .then(res => {
        loading.dismiss().then(() => this.showToast("更新基础数据成功!"));
      })
      .catch(err=>{
        loading.dismiss().then(() => this.showToast("更新失败:"+err));
      });
  }

  /**创建loading */
  createLoading(string) {
    return Loading.create({
      content: string,
      dismissOnPageChange: true
    });
  }
  /**显示提示框 */
  showToast(string){
      let toast = Toast.create({
        message: string,
        duration: 1500,
        cssClass: "primary",
        showCloseButton: true,
        closeButtonText: "关闭"
      });
      this.nav.present(toast);
  }

  help() {

  }
  aboutApp() {

  }
  aboutCompany() {

  }
  logout() {
    this.userService.logout();
    this.nav.setRoot(LoginPage);
  }
}
