import {BaseModel} from './base-model';

/**
 * 验收任务Model
 */
export class AcceptanceModel extends BaseModel{
    /** 维修派单时间 (要求开始时间) */
    SendsingleTime :string ;
    /** 要求维修完成时间 */
    AskFinsihedTime :string ;    
    /** 实际维修验收完成时间 */
    FeedbackTime :string ;
    
    /** 验收派单时间 */
    y :string ;
    /** 要求验收完成时间 */
    AskPDAFinishedTime :string ;

    IsView :string ;

    /** 管理单位 */
    MantanceManager :string ;
    /** 维修单位 */
    ReceivedUnitName :string ;

    /** 维修负责人 */
    sendsingManager :string ;
    /** 验收派单人 */
    YanshouPaidanRen :string ;
    /** 验收任务接收人 */
    PDAUsername :string ;

    /** 案件编号 */
    caseID :string ;


    /** 高速名称 */
    routeName :string ;
    /** 工程位置 方向+桩号 */
    gongchengweizhi :string ;
    /** 序号 */
    xuhao :string ;
    /** 维修方案 */
    weixiuFangAn :string ;
    /** 养护项目 */
    yanghuXiangmu :string ;


    /** 需要保存的数据 */
    /** 实际验收完成时间 */
    PDAFeedbackTime :string;
    /** 验收是否合格 */
    Remark :string = "合格";
    /** 是否同意计量 */
    IsAgreeAudit :string = "是" ;
    /** 管理单位验收人 */
    ManageDeptChecker :string ;
    /** 维修单位验收人 */
    RepairDeptChecker :string ;
    /** 验收确认单填报人 */
    CheckReporter :string ;
    /** 验收说明 */
    yanshouFeedbackDesc :string ;

    stakeOrder:number = 0;
    /** 预估工程量明细 , 自定义 */
    detail:any[]
}


/**
<DataContract()>
Public Class yanshouTaskInfo
    <DataMember()>
    Public Property caseID As String
    <DataMember()>
    Public Property SendsingleTime As String '要求维修时限
    <DataMember()>
    Public Property AskFinsihedTime As String '要求维修时限
    <DataMember()>
    Public Property routeName As String
    <DataMember()>
    Public Property gongchengweizhi As String
    <DataMember()>
    Public Property yanghuXiangmu As String
   
    <DataMember()>
    Public Property weixiuFangAn As String '维修方案
    <DataMember()>
    Public Property YanshouPaidanRen As String '验收派单人
    <DataMember()>
    Public Property ReceivedUnitName As String '维修单位
    <DataMember()>
    Public Property IsView As Boolean
    <DataMember()>
    Public Property MantanceManager As String '管理单位
    <DataMember()>
    Public Property sendsingManager As String '维修负责人
    <DataMember()>
    Public Property PDAUsername As String '验收任务接收人
    <DataMember()>
    Public Property yuguGongchengliang As List(Of yuguGongchengliang)

    <DataMember()>
    Public Property xuhao As String '序号

    <DataMember()>
    Public Property FeedbackTime As String '实际完成时限
    <DataMember()>
    Public Property SendToPDATime As String '验收派单时间
    <DataMember()>
    Public Property AskPDAFinishedTime As String '要求验收完成时间
   
    <DataMember()>
    Public Property PDAFeedbackTime As String '实际验收完成时间
    <DataMember()>
    Public Property Remark As String '验收是否合格
    <DataMember()>
    Public Property IsAgreeAudit As String '是否同意计量
    <DataMember()>
    Public Property ManageDeptChecker As String '自检人
    <DataMember()>
    Public Property RepairDeptChecker As String '维修验收人员
    <DataMember()>
    Public Property CheckReporter As String '填报人员
    <DataMember()>
    Public Property yanshouFeedbackDesc As String '验收说明
End Class
*/