import {Injectable,Inject} from '@angular/core';
import {Storage, LocalStorage, Events} from 'ionic-angular';
import * as _ from 'lodash';
import {AppConstant} from '../providers/app-constant';
import {Resource} from '../providers/resource';
import {Http, Headers, RequestOptions} from '@angular/http';

import {Device} from 'ionic-native';


import {HttpService} from '../pages/build/service/HttpService';

@Injectable()
export class UserService {

  private storage: any = new Storage(LocalStorage);
  private LOGGEDIN_KEY: string = "user";
  private EXTINFO_KEY: string = "userExtInfo";
  public  current: User 
  public static StaticCurrent:User;

  public extInfo:{
    /** 公路段信息 */
    gongluduanItems?:any[];
  } = {};

  constructor(private resource: Resource, private events: Events ,private http:Http) {

  }

  /** 登录验证 */
  login(loginInfo) {
    return new Promise((resolve, reject) => {
      this.UserLogin(loginInfo.username , loginInfo.password)
        .then(res => {
          if (res.success != true) {
            reject("无效的用户名和密码");
          } else {
            //解析用户信息
            var user = this.parseUserInfoFromLoginResponse(res);
            this.storage.setJson(this.LOGGEDIN_KEY, user);
            this.current = user;
            UserService.StaticCurrent = user;
            this.Getlocinfo(user.loc_id).then(res=>{
                UserService.StaticCurrent.loc_type = res.type;
                this.current.loc_type =  res.type;
                this.events.publish('user:login');
            });



          
          }
        })
        .then(() => {
            resolve();
        })
        .catch(err => {
          console.log(err.message)
          reject(err.message);
        });
    });
  }
  /** 解析登录返回的用户数据 */
  parseUserInfoFromLoginResponse(res) {
    res._currentUser.ValidateCode = res.ValidateCode;
    return res._currentUser;
  }

  UserLogin(username:string,password:string)
  {       
    
     var params = { "name": username, "password": password }
        return this.send("api/Account/authenticate", {
            disableAuth: true,
            method: "post",
            params: params
        });


  }
  Getlocinfo(loc_id)
  {       
    
  
        return this.send("api/location/"+loc_id, {
            disableAuth: false,
            method: "get",
            params: {}
        });

  }



    send(url: string, params: any):Promise<any> {
        var url = "http://60.29.110.104:8092/" + (params.url || url);
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
                request =  this.http.get(url, options);
                break;
            case "post":
                request = this.http.post(url, JSON.stringify(params.params), options);
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

  /** 退出 */
  logout() {
    this.storage.remove(this.LOGGEDIN_KEY);
    this.events.publish('user:logout');
  }

  /** 登录验证 */
  checkLoggedIn() {
    this.events.publish('loader:change', "验证用户信息");
    return this.storage.getJson(this.LOGGEDIN_KEY)
      .then((value) => {
        if (value) {
          this.current = value;
          UserService.StaticCurrent = value;

        this.Getlocinfo(UserService.StaticCurrent.loc_id).then(res=>{
            UserService.StaticCurrent.loc_type = res.type;
            this.current.loc_type =  res.type;
            this.events.publish('user:login');
        });
          this.events.publish('user:login');
        }
        return value;
      })
  }
}