import {Injectable} from '@angular/core';
import {Http, Headers, RequestOptions} from '@angular/http';
import {UserInfoModel} from '../model/UserInfoModel';
import {DatabaseService} from '../../../providers/database-service';
import {UserService} from '../../../providers/user-service';


import 'rxjs/add/operator/map';
import * as _ from 'lodash';
import * as moment from 'moment';


import '../model/UserModel';
import {ProjectModel} from '../model/ProjectModel';



@Injectable()
export class HttpService {

    public static url: string = "http://60.29.110.104:8092/";
    //public static url: string = "http://10.1.113.138:8081/";

    //public static url: string = "http://60.29.110.104:8092/";
    private sendurl: string = "http://m.5c.com.cn/api/send/?";
    private static key: string = "";
    private m_http;

    public static _currentUser: UserInfoModel;
    static headers: any;
    static options: any;
    static firstoption: any;
    private userinfo: any;


    set(value: any) {
        _.extend(this, value);
    }
    constructor(private http: Http, private dbcon: DatabaseService) {
        this.m_http = http;
        let head = new Headers({ 'Content-Type': 'application/json' });
        HttpService.firstoption = new RequestOptions({ headers: head });
        //this.dbcon.execute("drop table   longininfo ",null,"run");

        this.dbcon.execute("create table IF NOT EXISTS  longininfo (id integer primary key AutoIncrement,user varchar(30),password varchar(100), ValidateCode varchar(400),loc_id integer)", null, "run");

    }

    send(url: string, params: any):Promise<any> {
        var myurl = HttpService.url + (params.url || url);
        var method = params.method || "get";

        let headers: any = {
            'Content-Type': "application/json",
        };
        if (!params.disableAuth) {
            //获取用户信息中的token
            headers.Authorization = 'Basic ' + UserService.StaticCurrent.ValidateCode;
        }

        var options = _.extend({}, params.options);
        options.headers = _.extend(headers, options.header || {});


        console.log(params)
        var request;
        switch (method.toLowerCase()) {
            case "get":
                request = this.m_http.get(myurl, options);
                break;
            case "post":
                request = this.m_http.post(myurl, JSON.stringify(params.params), options);
                break;
        }

        return new Promise((resolve, reject) => {
            request
                .map(res => res.json())
                .subscribe(
                res => {
                    resolve(res);
                },
                err => {

                    err.body = JSON.parse(err._body);
                    let rs;
                    switch (err.status) {
                        case 503:
                            rs = err.body;
                            break;
                         case 501:
                            rs = err.body;
                            break;
                        default:
                            rs = err.body.message || "网络错误:返回无效的object";
                            break;
                    }

                    //this.events.publish('httperror', rs, err);
                    //reject(rs , err);
                    reject(err.body);
                }
                );
        });


    }


    public login(user: string, pwd: string) {

        var params = { "name": user, "password": pwd }
        return this.send("api/Account/authenticate", {
            disableAuth: true,
            method: "post",
            params: params
        });
    }


    //获取项目列表
    public GetLocinfo(loc_id) {

        return this.send("api/location?loc_id"+loc_id, {
            disableAuth: false,
            method: "get",
            params: {}
        });

    }
    //获取项目列表
    public GetProject(page,pagesize) {

        return this.send("api/project?page="+page+"&pagesize="+pagesize, {
            disableAuth: false,
            method: "get",
            params: {}
        });

    }

    //获取项目列表
    public GetProjectInfo(projectid: string) {

            return this.send("api/project/"+projectid, {
            disableAuth: false,
            method: "get",
            params: {}
        });
    }

    //获取项目实际进度列表

    public GetActProcess(projectid: string) {

          return this.send("api/project/"+projectid+ "/actschedule", {
            disableAuth: false,
            method: "get",
            params: {}
        });
    }
    //获取摸一个进度下的附件列表
    public GetActProcessPic(projectid: string, pasid: string) {
        return this.send("api/project/"+projectid+ "/actschedule/" + pasid + "/pic", {
            disableAuth: false,
            method: "get",
            params: {}
        });
    }
  //      return this.m_http.get(this.url + "api/project/" + projectid + "/actschedule/" + pasid + "/pic", HttpService.options);

    //获取节点模板管理
    public GetProjectNodes(projectid: string) {
       return this.send("api/project/" + projectid + "/templatenode", {
            disableAuth: false,
            method: "get",
            params: {}
        });
     //   return this.m_http.get(this.url + "api/project/" + projectid + "/templatenode", HttpService.options);
    }
    //保存进度信息
    public SaveCurProcess(params: any) {

               // var params = { "name": user, "password": pwd }
        return this.send("api/project/" + params.project_id + "/actschedule", {
            disableAuth: false,
            method: "post",
            params: params
        });

      //  return this.m_http.post(this.url + "api/project/" + params.project_id + "/actschedule", JSON.stringify(params), HttpService.options)
    }

        //创建项目问题
    public SaveProjectTrouble(params: any) {

        return this.send("api/project/" + params.project_id + "/trouble",{
            disableAuth: false,
            method: "post",
            params: params
        });

      //  return this.m_http.post(this.url + "api/safecheck", JSON.stringify(params), HttpService.options)
    }
    //获取项目问题大列表
    public GetTroubleList(page:any,pagesize:any) {

        return this.send("api/project/trouble?page="+page+"&pagesize="+pagesize, {
            disableAuth: false,
            method: "get",
            params: {}
        });

      //  return this.m_http.post(this.url + "api/safecheck", JSON.stringify(params), HttpService.options)
    }
    //获取单个问题
    public GetTrouble(projectid:any,troubid:any) {

        return this.send("api/project/"+projectid+"/trouble/"+troubid, {
            disableAuth: false,
            method: "get",
            params: {}
        });

      //  return this.m_http.post(this.url + "api/safecheck", JSON.stringify(params), HttpService.options)
    }

    //针对问题进行企业反馈
    public SaveTrouble(params:any) {

        return this.send("api/project/"+params.project_id+"/trouble/"+params.trou_id+"/resolve", {
            disableAuth: false,
            method: "post",
            params: params
        });

      //  return this.m_http.post(this.url + "api/safecheck", JSON.stringify(params), HttpService.options)
    }

    //获取安全检查列表
    public GetSafeList() {
     return this.send( "api/safecheck", {
            disableAuth: false,
            method: "get",
            params: {}
        });
    }

    public GetSafeListPage( page:any, pagesize:any) {
     return this.send( "api/safecheck/page?page="+page+"&pagesize="+pagesize, {
            disableAuth: false,
            method: "get",
            params: {}
        });
    }
    //获取安全检查信息
    public GetSafeListById(safeid: string) {
       return this.send("api/safecheck/" + safeid , {
            disableAuth: false,
            method: "get",
            params: {}
        });

      //  return this.m_http.get(this.url + "api/safecheck/" + safeid, HttpService.options);
    }


    //获取公司列表
    public GetSafeSignCompany(safeid,loc_id) {
       return this.send("api/safecheck/" + safeid+"/companyloc/"+loc_id , {
            disableAuth: false,
            method: "get",
            params: {}
        });

      //  return this.m_http.get(this.url + "api/safecheck/" + safeid, HttpService.options);
    }
    //获取公司列表
    public GetSafeCompListById(safeid: string) {
       return this.send("api/safecheck/" + safeid+"/company" , {
            disableAuth: false,
            method: "get",
            params: {}
        });

      //  return this.m_http.get(this.url + "api/safecheck/" + safeid, HttpService.options);
    }

    //获取企业反馈列表
    public GetSafeCompanyList(params: any) {
       return this.send( "api/safecheck/" + params.safe_id + "/fillback/" + params.loc_id , {
            disableAuth: false,
            method: "get",
            params: {}
        });

     //   return this.m_http.get(this.url + "api/safecheck/" + params.safe_id + "/fillback/" + params.loc_id, HttpService.options);
    }
    //保存企业反馈
    public SaveSafeCompany(params: any) {
      return this.send("api/safecheck/" + params.safe_id + "/fillback/" + params.loc_id, {
            disableAuth: false,
            method: "post",
            params: params
        });

        //return this.m_http.post(this.url + "api/safecheck/" + params.safe_id + "/fillback/" + params.loc_id, JSON.stringify(params), HttpService.options)
    }

    //创建随机安全检查
    public SaveSafeCheckMessage(params: any) {

        return this.send("api/safecheck", {
            disableAuth: false,
            method: "post",
            params: params
        });

      //  return this.m_http.post(this.url + "api/safecheck", JSON.stringify(params), HttpService.options)
    }




    public SendMsg(params: any) {
        return this.m_http.post(this.sendurl +
            "apikey=b693a36ea67a3677ad8ba03220df6798&username=rongshu1&password=rstjftz1&mobile=" +
            params.mobile + "&content=" + params.content, null, HttpService.options)

    }
    InitDb() {

    }
}