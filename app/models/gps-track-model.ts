import {BaseModel} from './base-model';

/**
 * 实时路况
 */
export class GpsTrackModel extends BaseModel{
	userName:string = "";  
	phoneId:string = ""; 
	userId:string = "";   
	direction:string = "0";  
	speed:string = "0";  
	x:string = "0";  
	y:string = "0"; 
	getAt:string = "";  
	message:string = ""; 
	isError:string = "0";	
}



