import {NavController , Events} from 'ionic-angular';
import {Component} from '@angular/core';

import {SyncService} from '../../providers/sync-service/sync-service';

@Component({
  templateUrl: 'build/pages/localdata/localdata.html',
})
export class LocaldataPage {
  
  private sources:any[];
  private localDataRecordCount:number = 0;
    
  constructor(
    private nav:NavController , 
    private events:Events , 
    private syncService:SyncService
  ) {    
    this.addEventHandlers();    
    this.sources = this.syncService.sources;
    this.updateLocalDataRecordCount();
  }
  updateLocalDataRecordCount(){
    this.localDataRecordCount = this.syncService.localDataRecordCount;
  }
  addEventHandlers(){    
    //当数据重新计算后 , 更新本地记录数
    this.events.subscribe('database:refresh' , () => this.updateLocalDataRecordCount());  
  }
  getItemClassName(item){
    var cls = [];
    cls.push(item.records ? (item.records.length == 0 ? "empty" : "noempty") : "empty");
    cls.push(item.isRunning ? "runing" : "");
    return cls.join(" ");
  }
  
  syncAll(){
    this.syncService.start();
  }
  
}
