import {NavController, Loading, Refresher, Events, Popover} from 'ionic-angular';
import {Component} from '@angular/core';
import * as _ from 'lodash';
import * as moment from 'moment';
import * as Enumerable from 'linq';

import {UserService} from '../../../providers/user-service';
import {DatabaseService} from '../../../providers/database-service';
import {Resource} from '../../../providers/resource';

//import {MaintainModel} from '../../../models/maintain-model';
//import {MaintainTabsPage} from './tabs';

import {QueryConditionPopoverPage} from '../../common/query-condition-popover/query-condition-popover';


export abstract class BaseQueryPage<T> {
  protected condition: any = {
    road: "",
    direction: "",
    dateOrder: "日期降序",
    stakeOrder: "桩号升序"
  };
  protected roads = [];
  protected directions = [];
  protected allTasks: T[] = [];
  protected tasks: any[] = [];
  protected isLoading = false;

  protected allDirectionText = "所有方向";

  /**下面是可能修改的变量 */
  protected loadingString = "查询数据";
  protected conditionRoadField = "routeName";
  protected conditionDirectionField = "fangxiang";
  protected orderByDateField = "";
  protected orderByDateFormat = "YYYY-MM-DD HH:mm:ss";
  protected orderByStakeField = "stakeOrder";

  constructor(
    protected nav: NavController,
    protected userService: UserService,
    protected resource: Resource,
    protected dbService: DatabaseService,
    protected events: Events
  ) {
    this.initCondition();
    this.initOptions();
    this.events.subscribe("successback", res => {
      var record = res[0];
      var index = _.findIndex(this.tasks, { "caseID": record.caseID });
      if (index > -1) {
        this.tasks.splice(index, 1);
      }
    });
    this.loadData().then(() => this.query());
    this.events.subscribe('conditionchange', () => {
      this.filterTask();
    });
  }
  initOptions() {

  }
  initCondition() {
    //设置查询条件的companyId
    this.condition.companyId = this.userService.current.companyId;
  }
  /**初始化读取数据 */
  loadData() {
    return this.getRoads();
  }
  /** 获取道路列表 */
  getRoads() {
    var sql = `select * from road where CompanyID = '${UserService.StaticCurrent.companyId}'`;
    return this.dbService.query(sql)
      .then(items => {
        _.each(items, (road) => {
          var directions = [];
          directions.push(
            { text: road.UpLink, value: /*"上行:" + */road.UpLink },
            { text: road.DownLink, value: /*"下行:" + */road.DownLink } ,            
            { text:this.allDirectionText , value:this.allDirectionText}
          );
          road.directions = directions;
        });
        this.roads = items;
        if (items.length > 0){
          var road = items[0];
          this.condition.road = road.totalRouteName;
          this.directions = road.directions;
          if (road.directions.length > 0){
            this.condition.direction = this.directions[0].value;
          }
        }
        //this.condition.road = items.length > 0 ? items[0].totalRouteName : "";
      })
  }

  /** 初始化pageoptions , 抽象方法 , 需要在子类中实现*/
  abstract getResource(): Promise<any>

  /** 查询 */
  query(refresher?: Refresher): void {
    this.isLoading = true;
    let loading;
    var fromRefresher = !!refresher;
    if (!fromRefresher) {
      loading = Loading.create({
        content: this.loadingString
      });
      this.nav.present(loading);
    }
    this.getResource()
      .then(tasks => {
        if (!fromRefresher) {
          loading.dismiss();
        } else {
          refresher.complete();
        }
        this.isLoading = false;
        this.allTasks = _.map(_.isArray(tasks) ? tasks : [], (n: any) => {
          //加桩号排序
          var stakeOrder = 0;
          //console.log(n.stakeNum)
          if (n.stakeNum && n.stakeNum.indexOf("+") > -1) {
            var stakeArray = n.stakeNum.split("-")[0].replace(/k/ig, "").split("+");
            if (stakeArray.length > 1) {
              stakeOrder = parseInt(stakeArray[0] || 0) * 1000 + parseInt(stakeArray[1]);
            }
          }
          n.stakeOrder = stakeOrder;

          
          //设置工程量
          var items = n["yuguGongchengliang"];
          var detail;
          if (_.isArray(items)) {
            var key = _.findKey(items[0], function (o) { return !!o });
            detail = _.map(items, key);
          } else if (_.isObject(items)) {
            var keys = _.keys(items);
            if (keys.length == 1) {
              detail = [items[keys[0]]];
            } else {
              detail = items;
            }
          } else {
            detail = [];
          }
          //修改字段
          _.each(detail, (n) => {
            n.jiliangUnit = n.jlUnit;
            n.jiliangDesc = n.jlDesc;
            n.jiliangDescSave = n.jlDescNew;
            n.gongchengL = n.gongchengLiang;
          });
          n["detail"] = detail;
          return <T>n;
        });
        this.filterTask();
      })
      .catch(err => {
        if (!fromRefresher) {
          loading.dismiss();
        } else {
          refresher.complete();
        }
        this.isLoading = true;
        this.allTasks = [];
      })
  }
  /**筛选及排序 */
  filterTaskRoad(task, road) {
    var rs = task[this.conditionRoadField] == road;
    //console.log("road" , this.conditionRoadField , task[this.conditionRoadField]  , road , rs);
    return rs;
  }
  filterTaskDirection(task, direction) {
    var rs = direction === this.allDirectionText || task[this.conditionDirectionField].indexOf(direction) > -1;
    //console.log("direction" , task[this.conditionDirectionField] , direction , rs);
    return rs;
  }
  orderByDate(task) {
    var dateValue = task[this.orderByDateField];
    if (!dateValue) return 1;
    var timer = moment(dateValue, this.orderByDateFormat).valueOf();
    var order = this.condition.dateOrder.indexOf("降序") > -1 ? -1 : 1;
    timer = timer * order;
    task.orderTimer = timer;
    return timer;

  }
  orderByStake(task) {
    return task[this.orderByStakeField] * (this.condition.stakeOrder.indexOf("降序") > -1 ? -1 : 1);
  }
  filterTask() {
    if (this.isLoading || this.allTasks.length == 0) return;
    let self = this;
    var road = this.condition.road,
      direction = this.condition.direction;
    /*
    var tasks = _.filter(this.allTasks, (n) => {
      return n.routeName == this.condition.road && n.gongchengWeizhi.indexOf(direction) > -1;
    });
    tasks.sort((n1, n2) => {
      return upOrdown == "上行" ? n1.stakeOrder - n2.stakeOrder : n2.stakeOrder - n1.stakeOrder;
    });
    this.tasks = tasks;
    */
    //筛选
    var result = Enumerable.from(this.allTasks)
      .where((n) => { return self.filterTaskRoad(n, road) && self.filterTaskDirection(n, direction) });

    //排序
    try {
      var tasks = result
        .orderBy(task => { return this.orderByDate(task) })
        .thenBy(task => { return this.orderByStake(task) })
        .toArray();
    } catch (e) {
      alert(e.message);
    }
    //console.log(tasks);
    this.tasks = tasks || [];
  }

  /**打开搜索条件 */
  presentPopover(myEvent) {
    let popover = Popover.create(QueryConditionPopoverPage, {
      condition: this.condition,
      roads: this.roads,
      directions: this.directions
    });
    popover.onDismiss(data => {
      if (!data) return;
      console.log(data);
    });
    this.nav.present(popover, {
      ev: myEvent
    });
  }

}
