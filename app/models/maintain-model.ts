import {BaseModel} from './base-model';

/**
 * 维修任务Model
 */
export class MaintainModel extends BaseModel{ 

    /** 维修派单时间 (要求开始时间) */
    SendsingleTime :string ;
    /** 要求维修完成时间 */
    AskFinsihedTime :string ;

    /**管理单位 */
    guanliDanwei:string;
    /** 维修单位 */
    weixiuDanwei:string;
    /** 维修派单人 */
    SendsingleUserName :string ;

    /** 案件编号 */
    caseID :string ;


    /** 高速名称 */
    routeName :string ;
    /** 工程位置 */
    gongchengWeizhi:string;
    /**  维修项目*/
    weixiuItem:string;
    /** 养护项目 */
    yanghuXiangmu:string;
    /** 序号 */
    xuhao :string ;

    /** 桩号 */
    stakeNum :string ;



    /** 需要保存的数据 */
    /** 维修说明 */
    FeedbackDesc :string ;
    /** 返回的维修时间 */
    FeedbackTime :string ;
    /** 维修反馈人 */
    feedbackUser :string ;
    /** 维修负责人 */
    fuzeUser :string ;
    /** 上报人员ID */
    reportUserID:string;
    /* 上报人员Truename **/
    reportUsername:string;

    /** 预估工程量明细 , 自定义 */
    detail: any[];

    stakeOrder: number;
}
