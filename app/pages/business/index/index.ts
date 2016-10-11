import {NavController, Events, Loading, Toast} from 'ionic-angular';
import {Component} from '@angular/core';
import {UserService} from '../../../providers/user-service';
import {AppConstant} from '../../../providers/app-constant';
import * as _ from 'lodash';

import {SettingPage} from '../../setting/setting';
import {LocaldataPage} from '../../localdata/localdata';
import {LoginPage} from '../../login/login';

import {EmptyPage} from '../empty/empty';
import {DiseaseTabsPage} from '../disease/tabs';
import {DynamicList} from '../../build/dynamic/DynamicList';
import {DynamicTroubleList} from '../../build/dynamic/trouble/DynamicTroubleList';
import {SafeList} from '../../build/safe/safelist';

//import {ProcessQueryPage} from '../process/query';



import {MaintainQueryPage} from '../maintain/query';
import {AcceptanceQueryPage} from '../acceptance/query';
import {CorrectionTabsPage} from '../correction/tabs';
import {CorrectionReviewQueryPage} from '../correction-review/query';
import {CorrectionTaskQueryPage} from '../correction-task/query';

import {GpsTrackService} from '../../../providers/gps-track-service';
import {BackList} from '../../build/dynamic/troubleback/backlist'


@Component({
  templateUrl: 'build/pages/business/index/index.html'
})
export class IndexPage {

  private allMenus: Menu[] = [
    //{ text: "动态项目", icon: "car", page: ProcessQueryPage},
    { text: "项目进度直报", icon: "logo-buffer", page: DynamicList},
    { text: "项目问题直报", icon: "help", page: DynamicTroubleList},
    { text: "项目问题反馈", icon: "filing", page: BackList},

    { text: "安全检查", icon: "medkit", page:SafeList },
    // { text: "个人设置", icon: "contact", page: SettingPage },
    // { text: "本地数据", icon: "list-box", page: LocaldataPage},
    { text: "退出登录", icon: "log-out", page:"logout"}
  ];

  private menus: Menu[] = [];
  private user: any;

  private gpsTrackIsStoped = true;


  constructor(
    private nav: NavController,
    private userService: UserService,
    private gpsTrackService: GpsTrackService,
    private events: Events
  ) {
    this.user = this.userService.current;
    var role = this.user.role;
    this.menus = this.allMenus.filter(item => { return !item.privileges || item.privileges.indexOf(role) > -1 });
    this.setGpsTrackStatus();
    /**
    this.events.subscribe("returntoindex", () => {
      if (!this.gpsTrackIsStoped) this.gpsTrackService.start();
    });
    */
  }
  setGpsTrackStatus() {
    this.gpsTrackIsStoped = this.gpsTrackService.getStatus();
  }
  onMenuTap(menu) {
      var page = menu.page || EmptyPage;
      if (_.isString(page)){
        this.executeAction(page);
      }else{
        this.nav.push(page, { menu: menu, fromIndex: true }).then(() => {
          //if (!this.gpsTrackIsStoped) this.gpsTrackService.pause();
        });
      }
  }
  executeAction(action){
    switch(action){
      case "logout":
          this.userService.logout();
          this.nav.setRoot(LoginPage);
        break;
    }
  }

  toggleTrack() {
    this.gpsTrackService.toggle();
    this.setGpsTrackStatus();
  }

  ionViewDidEnter() {
    if (!this.gpsTrackIsStoped) this.gpsTrackService.start();
  }
}