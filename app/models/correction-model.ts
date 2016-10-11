import {UserService} from '../providers/user-service';
import {BaseModel} from './base-model';
import * as moment from 'moment';

/**
 * 整改通知任务Model
 */
export class CorrectionModel extends BaseModel{
    /**备注 */
    beizhu :string = "";
    /**检查类别 */
    caseCatalog :string ;
    /**检查日期 */
    checkDate :string = moment().format("YYYY-MM-DD");
    /**车道 */
    chedao :string = "";
    /**用户companyid */
    companyID :string = UserService.StaticCurrent.companyId;
    /**方向 */
    fangxiang :string = "";
    /**高速名称 */
    highwayName :string = "";
    /**检查单位 */
    jianchaUnit :string = "路驰监理";
    /**检查人 */
    jianchaUsername :string ;
    /**扣分 */
    koufen :string = "0";
    note :string = "";    
    reporterID :string = UserService.StaticCurrent.id ;
    reporterName :string = UserService.StaticCurrent.truename;
    /**桩号 */
    stakeNum :string = "";
    /**检查项目 */
    subCatalog :string = "";
    /**养护单位 */
    yanghuUnit :string = UserService.StaticCurrent.dept;
    /**整改原因 */
    zhengaiYuanyin :string = "" ;
    /**整改方式 */
    zhenggaiFangshi :string = "派单";
    /**整改期限 */
    zhenggaiQixian :string = "1";
    /**桩号位置 */
    zhuanghaoweizhi :string ="道路桩号";  

    stakeNumK1:string = "";
    stakeNumP1:string = "";
    stakeNumK2:string = "";
    stakeNumP2:string = "";
      
}
