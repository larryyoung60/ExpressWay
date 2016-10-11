import {ViewController, NavParams, Events} from 'ionic-angular';
import {Component} from '@angular/core';
import * as _ from 'lodash';
import * as moment from 'moment';

import {UserService} from '../../../providers/user-service';
import {Resource} from '../../../providers/resource';

@Component({
  templateUrl: 'build/pages/common/query-condition-popover/query-condition-popover.html',
})
export class QueryConditionPopoverPage {
  public condition: any;
  public roads = [];
  public directions = [];
  constructor(private viewCtrl: ViewController, private navParams: NavParams, private events: Events) {
    this.condition = navParams.get("condition");
    this.roads = navParams.get("roads");
    this.directions = navParams.get("directions");
  }
  close() {
    this.viewCtrl.dismiss();
  }

  onItemClick(record) {
    this.condition.road = record.totalRouteName;
    this.directions = record.directions;
    this.condition.direction = this.directions[0].value;
    this.onModelChange();
  }


  onModelChange() {
    //console.log(this.condition)
    this.events.publish('conditionchange', this.condition);

  }
}
