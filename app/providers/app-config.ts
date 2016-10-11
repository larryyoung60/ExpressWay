import {Injectable} from '@angular/core';
@Injectable()
export class AppConfig {
  public static apiUrl:string = "http://61.136.61.40:8185/PDAService.svc";
  public static devApiUrl:string = "/wcf/";
  public static uploadUrl:string = "http://61.136.61.40:8185/imgUpload.aspx";
  
  //public static gpsTrackTimer:number = 10;  //gps上传间隔
  
  /** GPS配置信息 */
  public static gpsConfig = {
      //定位结果缓存时间
      maximumAge: 0, 
      //超时,超过X秒后停止定位
      timeout: 5000, 
      //是否使用高精度定位,使用网络 , GPS同时定位
      enableHighAccuracy: true
  };
  
  
  //病害上报相关设置
  public static disease:any = {
      mediaRequired: true ,          //是否必须上传照片
      coordsRequired: false          //是否必须获取到坐标 , 获取不到则不能提交
  };
  
}