import {UserService} from '../../../providers/user-service';
import {BaseModel} from '../../../models/base-model';
/**
 * 病害上报Model
 */
export class ProcessModel extends BaseModel{ 

    pas_id:string;
    /** 节点id */
    pnode_id:string;
    
    /** 填报日期 */
    act_date:string;    
    /** 当前进度 */
    act_process:string;
    /** 备注 */
    node_memo:string; 
    /**文件列表 */
    filelist:string[];
      
}
