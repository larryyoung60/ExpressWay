import {Events, NavController, NavParams, ViewController, Alert, Loading, Modal, Toast , LocalStorage , Storage} from 'ionic-angular';
import {Component, ViewChild} from '@angular/core';
import {NgForm} from '@angular/common';
import {Geolocation} from 'ionic-native';
import * as _ from 'lodash';

import {AppConfig} from '../../../providers/app-config';
import {AppConstant} from '../../../providers/app-constant';
import {DatabaseService} from '../../../providers/database-service';
import {UserService} from '../../../providers/user-service';


export class BaseFormPage<T> {
  /** 获取mainform */
  @ViewChild('mainForm') protected mainForm: NgForm;

  /** 当前用户 */
  protected currentUser: User = UserService.StaticCurrent;
  /** 页面表单信息,从tabs接收 */
  protected result: T;

  constructor(
    protected events: Events,
    protected nav: NavController,
    protected navParams: NavParams,
    protected dbService: DatabaseService
  ) {
    this.result = <T>(navParams.get("result") || {});
    this.nav = navParams.get("nav");    
    
    //将form发送到tabs
    setTimeout(() => {
      this.events.publish("getform", this.mainForm);
    }, 0);
  }

}
