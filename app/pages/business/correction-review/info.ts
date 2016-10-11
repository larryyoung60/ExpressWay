import {NavParams} from 'ionic-angular';
import {Component} from '@angular/core';
import * as _ from 'lodash';
import * as moment from 'moment';

/*
  整改信息
*/
@Component({
  templateUrl: 'build/pages/business/correction-review/info.html',
})
export class CorrectionReviewInfoPage {
  public result:any = {};
  constructor(navParams : NavParams) {
    this.result = navParams.get("result");
    console.log(this.result)
  }
}
