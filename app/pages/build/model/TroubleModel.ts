import {UserService} from '../../../providers/user-service';
import {BaseModel} from '../../../models/base-model';
/**
 * 病害上报Model
 */
export class TroubleModel extends BaseModel{ 

        public project_name:string;
        //工程代码
        public project_code:string;
        //创建人名称
        public user_name:string;
        public  trou_id:string;
        //项目主键
        public  project_id:string;
        //问题类型 资金问题/其他问题/计划回收土地/方案调整
        public trou_type:string;
        //问题内容
        public trou_desc:string;
        //解决方法
        public cur_status:string;
        //设计部门
        public loc_type:string;
        //状态
        public status:string;
        //创建时间
        public   create_date:string;
        //创建人
        public   create_user:string;
        //限定整改时间
        public   limit_date:string;
        //发现时间
        public   find_date:string;
        public isstop:string;
     
}




