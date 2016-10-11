import {UserService} from '../../../providers/user-service';
import {BaseModel} from '../../../models/base-model';
/**
 * 病害上报Model
 */
export class SafeModel extends BaseModel{ 

      /// <summary>
        /// 主键
        /// </summary>
       safe_id:string;
        /// <summary>
        /// 标题
        /// </summary>
         title:string;
        /// <summary>
        /// 检查编号
        /// </summary>
         check_no:string;
         check_type:string;
        /// <summary>
        /// 检查组长
        /// </summary>
        temleader:string;
        /// <summary>
        /// 检查内容
        /// </summary>
         safe_content:string;
        /// <summary>
        /// 是否删除
        /// </summary>
         status:string;
        /// <summary>
        /// 当前状态
        /// </summary>
         cur_status:string;
        /// <summary>
        /// 检查对象类型 在建项目/企业/配套设施
        /// </summary>
         object_type:string;
        /// <summary>
        /// 检查类型 五一 十一 专项
        /// </summary>
         spctype:string;
        /// <summary>
        /// 创建人
        /// </summary>
         create_user:string;
        /// <summary>
        /// 创建时间
        /// </summary>
         create_date:string;

         team_name:string;

         create_name:string;

         spctype_name:string;
         object_type_name:string;

         start_time:string = moment().format("YYYY-MM-DD") ;
         end_time:string = moment().format("YYYY-MM-DD");
}
