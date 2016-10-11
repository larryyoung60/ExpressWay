import {Injectable} from '@angular/core';
import {Storage, LocalStorage, Events} from 'ionic-angular';
import {Device} from 'ionic-native';
import * as _ from 'lodash';

@Injectable()
export class SettingService {

  private storage:any = new Storage(LocalStorage);
  private SETTING_KEY:string = "setting";
  
  setting:Object = {
    /** 版本 */
    version: "0.0.1" ,
    /** 是否允许自动上传 */ 
    autoUpload: true ,
    /** 仅在WIFI下上传 */
    uploadOnlyWifi:false ,
    /** 上传最大线程 */ 
    maxUploadThread:5 ,
    /**　照片治理那个 */ 
    photoQuality:80 ,
    /** 拍照是否保存到相册 */
    photoSaveToAlbum: true ,
    /** 照片尺寸 */
    photoSize:"1000x1780" , 
    /** GPS轨迹采集开启方式 */
    gpsTrackStartType: "manual" ,
    /** gps轨迹采集间隔时间(秒) */ 
    gpsTrackTime: 10
  };
  
  device:any = {};

  constructor(private events:Events) {
  }
  getDeviceInfo(){
    this.device = Device.device;
  }
  
  //设置
  setSetting(setting?:Object) {
    this.events.publish('loader:change', "加载默认配置信息");
    if (setting) this.setting = setting;
    this.storage.setJson(this.SETTING_KEY , this.setting);
    return Promise.resolve(this.setting);
  }
  //读取设置
  getSetting(){
    this.events.publish('loader:change', "读取配置信息");
    return this.storage.getJson(this.SETTING_KEY)
      .then(v=>_.extend(this.setting , v));
  }
  set(key , value){
    this.setting[key] = value;
    this.setSetting();
  }
  get(key){
    return this.setting[key];
  }
}

