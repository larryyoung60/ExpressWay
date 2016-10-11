import {Injectable} from '@angular/core';
@Injectable()
export class AppVersions {
  /**要安装的APP version */
  public static version = "0.0.2";

  /**版本信息列表 */
  public static versions:{version:string;sqlFile?:string;syncs?:string[];description?:string;changeLog?:string}[] = [
    {version:"0.0.1" , sqlFile:"v0.0.1.sql" , syncs:["road" , "catalog" ,"manager" ,"correctioncatalog"]}
  ];
  
}