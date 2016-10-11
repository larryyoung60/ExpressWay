import {Injectable} from '@angular/core';

export class ProjectModel {

        project_id:string;
        project_name:string;
        project_code:string;
        //监理单位
        officer_id:string;
        //项目所属机构 投资方建设方
        loc_id:string;
        //项目建设单位 施工方
        build_id:string;
        //是否被列为固投计划
        invest:string;
        
        position_desc:string;
        office_phone:string;
        mobile:string;
        home_phone:string;
        email:string;
        imagepath:string;
        address:string;
        islocked:string;
        salt:string;

    }
