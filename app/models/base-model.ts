import * as _ from 'lodash';
import * as moment from 'moment';
import {UserService} from '../providers/user-service';

export abstract class BaseModel{
    id:string;
	remoteId:string;
	mediaType:string;

	set(value:any){
		_.extend(this , value);
	}
	
	/** 获取当前日期字符串 */
	getDateString(format:string = "YYYY-MM-DD") {
		return moment().format(format);
		/*
		return [
		date.getFullYear(),
		_.padStart((date.getMonth() + 1).toString(), 2, "0"),
		_.padStart(date.getDate().toString(), 2, "0")
		].join("-");
		*/
	}
	
	newId(){
		this.id = new Date().getTime().toString()+_.padStart((_.random(1 , 1000)*_.random(1,1000)).toString() , 7 , "0");
	}
}