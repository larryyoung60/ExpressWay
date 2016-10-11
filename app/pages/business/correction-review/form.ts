import {Events, NavController, NavParams, ViewController, Alert, Loading, Modal, Toast} from 'ionic-angular';
import {Component} from '@angular/core';
import {Geolocation} from 'ionic-native';
import * as _ from 'lodash';
import * as moment from 'moment';

import {AppConfig} from '../../../providers/app-config';
import {AppConstant} from '../../../providers/app-constant';
import {DatabaseService} from '../../../providers/database-service';
import {Resource} from '../../../providers/resource';
import {SettingService} from '../../../providers/setting-service';
import {UserService} from '../../../providers/user-service';

import {BaseFormPage} from '../base/base-form';
import {MaintainModel} from '../../../models/maintain-model';

/*
  填写维修任务
*/
@Component({
  templateUrl: 'build/pages/business/correction-review/form.html',
})
export class CorrectionReviewFormPage extends BaseFormPage<MaintainModel> {
  public reviewResults = ["合格","不合格","申请延期"];
  private fens: any[] = _.range(0,20.5,.5);

  constructor(events: Events,nav: NavController,navParams : NavParams ,dbService: DatabaseService) {
    super(events , nav , navParams , dbService);
  }
}
