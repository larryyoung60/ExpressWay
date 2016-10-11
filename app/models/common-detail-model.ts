import {UserService} from '../providers/user-service';
import {BaseModel} from './base-model';
/**
 * 工程明细Model
 */
export class CommonDetailModel extends BaseModel{ 
    /** 本地主记录ID */
	localParentId:string;
	/** 远程主记录ID */
	remoteParentId:string;

	/** 养护类别 */
	catalog:string;
	parentCatalog:string;
	subName:string;
	dealWith:string;
	/** 维修方案 (养护项目)*/
	weixiuFangAn:string;  
	sunhuaiqingkuang:string;

	/** 工程量 */
	gongchengL:string;
	/** 工程量单位 */
	jiliangUnit:string;
	/** 描述 */
	jiliangDesc:string;
	/** 描述文本 */
	jiliangDescSave:string;
	timelist:string;

	stakeNum:string;
	stakeNumP1:string;
	stakeNumK1:string;


	length:number;
	width:number;
	height:number;

	isChecked:boolean = false;
}