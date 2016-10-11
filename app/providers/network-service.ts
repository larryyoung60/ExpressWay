import {Injectable} from '@angular/core';
import {Events} from 'ionic-angular';
import {Network, Connection} from 'ionic-native';

import {SettingService} from './setting-service';

@Injectable()
export class NetworkService {
  
  private connection:Connection;  
  private connected:boolean;
  
  constructor(private events:Events , private settingService:SettingService) {    
    this.connection = Network.connection;    
    this.connected = this.connection && this.connection != Connection.NONE;
    this.init();
  }
  
  init(){
      let connectSubscription = Network.onConnect().subscribe(() => {
        this.connected = true;
        console.log('network connected!');
        setTimeout(() => {
          this.connection = Network.connection;
          this.events.publish("network:connect" , this.connection);
          console.log(Network.connection);
          if (Network.connection === Connection.WIFI) {            
            console.log('we got a wifi connection, woohoo!');
          }
        });
      });
      
      let disConnectSubscription = Network.onDisconnect().subscribe(() => {
        this.connected = false;
        console.log('network disconnected!');
        setTimeout(() => {
          this.connection = Connection.NONE;
          this.events.publish("network:disconnect");
        });
      });   
  }
  
  allowUpload(){
    //是否有网络连接
    if (!this.connected) return false;
    //是否只在WIFI下上传
    if (this.settingService.get("uploadOnlyWifi") === true && this.connection != Connection.WIFI) return false;
    return true;
  }
  
}

