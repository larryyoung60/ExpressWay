import {UserService} from '../providers/user-service';
import {BaseModel} from './base-model';
import * as moment from 'moment';

/**
 * 整改复查Model
 */
export class CorrectionReviewModel extends BaseModel{
    /**要求完成时间 */
    askFinishedDate :string ;
    /**检查类别 */
    caseCatalog :string ;
    /** 案件ID */
    caseID :string ;
    /**检查日期 */    
    checkDate :string ;
    /**车道 */    
    chedao :string ;
    /**用户companyid */
    companyID :string = UserService.StaticCurrent.companyId;
    /**方向 */
    fangxiang :string ;
    

    /** 反馈内容 */
    feedbackTime :string = moment().format("YYYY-MM-DD");
    feedbackUser :string ;
    fuchaDesc :string;
    fuchaKoufen :string ;
    fuchaMemo :string ;
    fuchaResult :string;
    
    /**高速名称 */
    highwayName :string ;
    /**检查单位 */
    jianchaUnit :string ;
    /**检查人 */
    jianchaUsername :string ;
    /**扣分 */
    koufen :string ;
    /** 派单次数 */
    padanTimes :string ;
    reporterID :string = UserService.StaticCurrent.id;
    reporterName :string = UserService.StaticCurrent.truename;
    /**桩号 */
    stakeNum :string ;
    /**检查项目 */
    subCatalog :string ;
    /**养护单位 */
    yanghuUnit :string ;
    /**整改原因 */
    zhengaiYuanyin :string ;
    /**整改期限 */
    zhenggaiQixian :string ;
    /**完成状态 */
    zhenggaiWanchengStatus :string ;
    /**桩号位置 */
    zhuanghaoweizhi :string ;

    stakeOrder:number;
}

/**
            <a:zhenggaiFuchaInfo>
               <a:askFinishedDate>2016-7-5 1:29:17</a:askFinishedDate>
               <a:caseCatalog>交通设施</a:caseCatalog>
               <a:caseID>S1-E-20160630-1334</a:caseID>
               <a:checkDate>2016-6-30 1:29:17</a:checkDate>
               <a:chedao>路缘带</a:chedao>
               <a:companyID i:nil="true"/>
               <a:fangxiang>天津-蓟县</a:fangxiang>
               <a:feedbackTime i:nil="true"/>
               <a:feedbackUser i:nil="true"/>
               <a:fuchaDesc>备注</a:fuchaDesc>
               <a:fuchaKoufen i:nil="true"/>
               <a:fuchaMemo i:nil="true"/>
               <a:fuchaResult i:nil="true"/>
               <a:highwayName>S1津蓟高速K0-K102+560</a:highwayName>
               <a:jianchaUnit>路驰监理</a:jianchaUnit>
               <a:jianchaUsername>张亚鹏、李文达</a:jianchaUsername>
               <a:koufen>0</a:koufen>
               <a:padanTimes>1</a:padanTimes>
               <a:reporterID i:nil="true"/>
               <a:reporterName i:nil="true"/>
               <a:stakeNum>K50+100-500-K49+400</a:stakeNum>
               <a:subCatalog>钢护栏维护</a:subCatalog>
               <a:yanghuUnit>津北养护中心</a:yanghuUnit>
               <a:zhengaiYuanyin>钢护栏线形调直</a:zhengaiYuanyin>
               <a:zhenggaiQixian>5</a:zhenggaiQixian>
               <a:zhenggaiWanchengStatus>整改完成</a:zhenggaiWanchengStatus>
               <a:zhuanghaoweizhi>区间</a:zhuanghaoweizhi>
            </a:zhenggaiFuchaInfo>

 */