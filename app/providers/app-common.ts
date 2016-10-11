import {Injectable} from '@angular/core';
@Injectable()
export class AppCommon {  
  //病害上报相关设置
  public static newModelId(){
		return new Date().getTime().toString()+_.padStart((_.random(1 , 1000)*_.random(1,1000)).toString() , 7 , "0");
  };  
}
