import {UserService} from '../providers/user-service';
import {BaseModel} from './base-model';
/**
 * 病害上报Model
 */
export class DiseaseModel extends BaseModel{ 

    /** 病害位置 */
    binghaiweizhi:string;
    /** 病害ID */
    caseID:string;
    
    /** 类别 */
    catalog:string;    
    /** 分项目 */
    parentClg:string;
    /** 巡查 */
    subClg:string; 
    /** 损害情况 */
    dealwith:string;

    /** 车道 */
    chedao:string = "";
    /** 行车方向 */
    fangxiang:string;   
    /** 高速名称 */
    routeName:string;
    /** 高速编号 */
    routeNum:string;
    /** 桩号 */
    stakeNum:string;

    stakeNumK1:string = "";
    stakeNumP1:string = "";
    stakeNumK2:string = "";
    stakeNumP2:string = "";

    /** 备注 */
    memo:string;

    /** 天气 */
    others:string = "晴";

    /** 角色ID */
    companyID:string = UserService.StaticCurrent.companyId;
    /** 用户部门名称 */
    deptName:string = UserService.StaticCurrent.dept;
	/**检查日期 */
    reportTime:string = this.getDateString();   
    /** 用户truename */
    reporter:string = UserService.StaticCurrent.truename;
    /** 用户truename */
    truename:string = UserService.StaticCurrent.truename;
    /** 用户ID */
    userID:string = UserService.StaticCurrent.id;

	/**X坐标 */
    x:string = "0";            
	/**Y坐标 */
    y:string = "0";      
}
