
interface NoParamConstructor<T> {
	new (value?: any): T;
}

interface SimpleResult {
	isok: boolean;
	type?: string;
	message?: string;
	data?: any;
}


interface Menu {
	text: string;
	icon: string;
	cssClass?: string,
	privileges?: string[];
	page?: any
}

/**
 * 登录用户信息
 */
interface User {
	/**用户所在机构ID*/
	companyId?: string;
	/**用户ID */
	id?: string;
	/**所在路段 */
	road?: string;
	/** 用户所在机构*/
	dept?: string;
	/**用户全名 */
	truename?: string;
	/**用户登录帐号 */
	username?: string;
	userStatus?: string;
	version?: string;
	/**用户角色 , 通过section判断 , daoban=道班 , gongluduan = 公路段 , gongluju=公路局*/
	role?: string;

	user_id:string;
	name:string;
	password:string;
	sex:string;
	birthday:string;
	position:string;
	position_desc:string;
	office_phone:string;
	mobile:string;
	home_phone:string;
	email:string;
	imagepath:string;
	address:string;
	islocked:string;
	salt:string;
	loc_id:string;
	status:string;
	create_user:string;
	create_date:string;
	ValidateCode:string;
	loc_type:string;



}


/** 业务页面配置信息 */
interface BasePageOptions {
	/** 页面title */
	title:string;
	/** 页面保存按钮文本 */
	saveButtonText:string;
	/** 当前操作的类型 */
	type: string;
	/** 主记录对应的表名 */
	tableName: string;
	/** 主记录的字段 */
	modelFields: string[],
	/** record 验证错误信息 */
	recordInvalidMessage: string;
	/** 是否有照片 */
	hasMedia: boolean;
	/**对应的照片的类型 */
	mediaType: string;
	/** 是否必须上传照片 */
	mediaRequired: boolean;
	/** 媒体验证错误信息 */
	mediaInvalidMessage: string;
	/** 是否有明细 */
	hasDetail: boolean;
	/** 明细记录字段 */
	detailFields: string[],
	/** 明细表名 */
	detailTableName: string;
	/** 是否需要填写明细记录 */
	detailRequired: boolean;
	/** 明细验证错误 */
	detailInvalidMessage: string;
	/** 是否需要获取坐标 */
	useCoords: boolean;
	/** 是否必须获取到坐标 , 获取不到则不能提交*/
    coordsRequired: boolean;
	/** 保存时候哦Loading的字符串 */
	loadingContent: string;
}

/** 同步类配置 */
interface BaseSyncOptions {
	/** 当前操作的类型 */
	type: string;
	/** 主记录对应的表名 */
	tableName: string;
	/** 是否有照片 */
	hasMedia: boolean;
	/**对应的照片的类型 */
	mediaType: string;
	/** 是否有明细 */
	hasDetail: boolean;
	/** 明细表名 */
	detailTableName: string;
}
