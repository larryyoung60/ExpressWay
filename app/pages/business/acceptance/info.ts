import {NavParams} from 'ionic-angular';
import {Component} from '@angular/core';
import * as _ from 'lodash';
import * as moment from 'moment';

/*
  验收派单信息
*/
@Component({
  templateUrl: 'build/pages/business/acceptance/info.html',
})
export class AcceptanceInfoPage {
  public result:any = {};
  constructor(navParams : NavParams) {
    this.result = navParams.get("result");
  }
}
