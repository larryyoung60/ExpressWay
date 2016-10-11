  import {UserService} from '../../../providers/user-service';
import {BaseModel} from '../../../models/base-model';
/**
 * 病害上报Model
 */
export class SafeCompany extends BaseModel{ 
         fill_id:string;
        //企业表信息主键
         sc_id:string;
        /// <summary>
        /// 挑勾内容（逗号分隔）
        /// </summary>
         check_item:string;
        /// <summary>
        /// 填写人
        /// </summary>
         emp_id:string;
        /// <summary>
        /// 填写是时间
        /// </summary>
          create_date:string;
        /// <summary>
        /// 填写类型
        /// </summary>
         fill_type:string;
        /// <summary>
        /// 问题内容
        /// </summary>
        loc_content:string;
        /// <summary>
        /// 整改及落实情况
        /// </summary>
         imple_content:string;
        /// <summary>
        /// 机构id
        /// </summary>
         loc_id:string;
        /// <summary>
        /// 当前状态
        /// </summary>
        cur_status:string;
        /// <summary>
        /// 文件列表
        /// </summary>
         filelist:string[];
        /// <summary>
        /// 限定整改完成时间
        /// </summary>
         limit_date:string;
        /// <summary>
        /// 限定整改提交时间
        /// </summary>
         submit_date:string;
}