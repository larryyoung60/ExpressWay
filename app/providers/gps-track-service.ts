import {Injectable} from '@angular/core';
import {Events} from 'ionic-angular';
import {Geolocation} from 'ionic-native';
import * as moment from 'moment';
import {UserService} from './user-service';
import {SettingService} from './setting-service';
import {DatabaseService} from './database-service';
import {GpsTrackModel} from '../models/gps-track-model';

import {AppConfig} from '../providers/app-config';

@Injectable()
export class GpsTrackService {

  private tracker: any;
  private trackStatus = "stop";
  private isStoped = true;
  private hasThread = false;

  constructor(
    private events: Events,
    private settingService: SettingService,
    private userService: UserService,
    private databaseService: DatabaseService
  ) {
  }

  initAfterLogin() {
    this.isStoped = this.settingService.get("gpsTrackStartType") != "auto";
  }

  initBackgroundMode() {


  }

  getStatus() {
    return this.isStoped;
  }

  autoStart() {
    this.track();
  }

  start() {
    this.isStoped = false;
    this.track();
  }
  
  pause(){    
    this.isStoped = true;
  } 

  stop() {
    this.isStoped = true;
    this.hasThread = false;
  }

  toggle() {
    this.isStoped = !this.isStoped;
    this.track();
  }

  track() {
    if (this.isStoped) return;
    if (this.hasThread) return;
    this.hasThread = true;
    this.getGeoLocation()
      .then(model => this.saveToDatebase(model))
      .then(() => this.next())
      .catch((err) => {
        var msg = err ? (err.message || err) : err;
        console.log("track err: " + msg);
        this.next();
      });
  }

  getGeoLocation() {
    let model = new GpsTrackModel();
    model.newId();
    model.userName = this.userService.current.username;
    model.phoneId = this.settingService.device.serial || this.settingService.device.uuid || "";
    model.userId = this.userService.current.id;
    model.getAt = moment().format("YYYY-MM-DD HH:mm:ss");
    return Geolocation.getCurrentPosition(AppConfig.gpsConfig)
      .then((res) => {
        model.direction = res.coords.heading ? res.coords.heading.toString() : "0";
        model.speed = res.coords.speed ? res.coords.speed.toString() : "0";
        //这里是反的
        model.y = res.coords.longitude ? res.coords.longitude.toString() : "0";
        model.x = res.coords.latitude ? res.coords.latitude.toString() : "0";
        return model;
      })
    // .catch(err => {        
    //   console.log(err.message);
    //   model.isError = "1";
    //   model.message = err.message;
    //   return model;
    // });
  }

  saveToDatebase(record) {
    var fields = ["id", "userName", "phoneId", "userId", "getAt", "direction", "speed", "x", "y", "isError", "message"];
    var values = _.map(fields, (n) => { return "'" + record[n] + "'"; });
    var sql = `insert into LocalGpsTrack (${fields.toString()}) values (${values.toString()});`;
    return this.databaseService.run([sql])
      .then(() => {
        this.events.publish('database:add', "GpsTrack");
      });
  }

  next() {
    var timer = this.settingService.get("gpsTrackTime") * 1000;
    setTimeout(() => {
      this.hasThread = false;
      this.track()
    }, timer);
  }
}

