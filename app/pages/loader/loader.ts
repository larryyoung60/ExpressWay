import {NavController, MenuController, Events} from 'ionic-angular';
import {Splashscreen} from 'ionic-native';
import {Component} from '@angular/core';
import * as _ from 'lodash';
import {AppConstant} from '../../providers/app-constant';
import {LoaderService} from '../../providers/loader-service';
import {LoginPage} from '../../pages/login/login';
import {WelcomePage} from '../../pages/welcome/welcome';
import {IndexPage} from '../../pages/business/index/index';

@Component({
  templateUrl: 'build/pages/loader/loader.html',
})
export class LoaderPage {
  
  message:string = "系统加载中";
  isError:boolean = false;
  

  constructor(
    private nav: NavController,
    private menu: MenuController,
    private events: Events,
    private loaderService: LoaderService
  ) {
    this.menu.enable(false);
    this.events.subscribe('loader:change', (message) => {
      this.message = message;
    });
    Splashscreen.hide();
    console.log(new Date().getTime() - AppConstant.AppStartTime);    
    this.init();
  }
  /**
   * 1. 判断是否安装过 , 通过读取version , isInstalled
   * 2. 如果没有安装过
   *    2.1 创建数据库表 , sqlite
   *    2.2 同步数据
   *    2.3 写入默认配置 setting
   *    2.4 写入version数据, 安装完成
   *    2.5 执行3中安装后过程
   * 3. 如果安装过
   *    3.1 读取程序的配置 setting
   *    3.2 判断是否登录 , 通过读取user , hasLoggedIn
   *    3.3 已登录
   *        3.3.1 读取用户信息到userservice
   *        3.3.1 跳转到IndexPage
   *    3.4 登录跳转到LoginPage
   */
  init() {
    this.isError = false;
    this.install()  //安装 , 如果已安装,到下一步      
      .then(()=> this.update())
      .then(() => this.start())
      .catch(err => {
        this.isError = true;
        var errMessage = "未知错误";
        if (err) {
          errMessage = _.isString(err) ? err : (err.err ? err.err.message : err);
        }
        this.message += ":" + errMessage;
      });      
  }

  //安装
  install() {
    return this.loaderService.isInstalled()
      .then(isInstalled => {
        if (!isInstalled) {
          return this.loaderService.install();
          //已安装过 , 启动
        } else {
          return Promise.resolve(isInstalled);
        }
      });
  }

  //新版本
  update(){
    return this.loaderService.isNewVersion()
      .then(isNewVersion => {
        if (!isNewVersion) {
          return this.loaderService.update();
        } else {
          return Promise.resolve(isNewVersion);
        }
      });

  }

  //启动
  start() {
    return this.loaderService.start()
      .then((isLoggedin) => {
        this.events.publish('loader:change', "跳转中");
        var targetPage = null;
        if (isLoggedin) {
          targetPage = IndexPage;
        } else {
          targetPage = LoginPage;
        }
        this.menu.enable(true);
        this.nav.setRoot(targetPage);
      });
  }
}