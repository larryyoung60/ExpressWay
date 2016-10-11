import {NavParams} from 'ionic-angular';
import {Component} from '@angular/core';
import * as _ from 'lodash';
import * as moment from 'moment';

/*
  验收派单信息
*/
@Component({
  templateUrl: 'build/pages/business/maintain/info.html',
})
export class MaintainInfoPage {
  public result:any = {};
  constructor(navParams : NavParams) {
    this.result = navParams.get("result");
    console.log(this.result)
  }
}
