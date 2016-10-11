import {Injectable} from '@angular/core';
@Injectable()
export class AppConstant {
  
  public static AppStartTime = new Date().getTime();

  public static Weathers:string[] = [
    "晴", "阴", "雨" , "雪" , "雾" , "沙尘" , "晴转多云" , "晴转小雨" , "晴转阴" , "多云转晴" , "小雨转晴" , "阴转晴" ,
    "暴雨" , "多云"
  ];
  
  public static Binghaisuoshu:string[] = [
    "路面路基交通工程沿线设路线交叉绿化", "桥涵上部", "桥涵下部及河道", "隧道"
  ];
  
  public static Role = {
    /**上报权限 */
    ShangBao: "上报权限" ,
    /**监理权限 */ 
    JianLi: "监理权限"
  };
  
  public static MediaType = {
    /**病害上报 */
    Disease: "GvFq1bBN+C1wBg14W0CoPw==" , 
    /**维修任务反馈 */
    Maintain: "1oyaY3vg0H4Y0JlTadpLpRJdBn/pZ0UO" ,
    /**验收任务反馈 */
    Acceptance: "e6P03+KT/SooqnJi0XjHRVOHSA3lCDi7" ,
    /**整改通知*/
    Correction: "GvFq1bBN+C1wBg14W0CoPw==" ,
    /**整改复查 */
    CorrectionReview: "tTNkDpbru0dPeMFrQjxIM2MmGhg4NXlo"
  };
  
// 上报文件：GvFq1bBN+C1wBg14W0CoPw==
// 维修反馈文件：1oyaY3vg0H4Y0JlTadpLpRJdBn/pZ0UO
// 验收反馈文件：e6P03+KT/SooqnJi0XjHRVOHSA3lCDi7
  
  
}
