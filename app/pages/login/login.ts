import {NavController , MenuController , Loading , Alert} from 'ionic-angular';
import {Component} from '@angular/core';
import {IndexPage} from '../business/index/index';
import {UserService} from '../../providers/user-service';

//import {HttpService} from '../../pages/build/service/HttpService';


@Component({
  templateUrl: 'build/pages/login/login.html'
})
export class LoginPage {
  
  private login:{username:string;password:string} = {username:"" , password:""};
  private submitted:boolean = false;        

  constructor(
    private nav:NavController, 
    private menu:MenuController , 
    private userService:UserService
  ) {
    this.menu.enable(false);
  }

  onLogin(form) {
    var me = this ,
        nav = this.nav;
    this.submitted = true;
    if (!form.valid) return false;
    let loading = Loading.create({
      content: "登录中..." ,
      dismissOnPageChange : true 
    });
    this.nav.present(loading);
    this.userService.login(this.login)
      .then((d)=>{
        //this.httpservice.login("admin","123");
        loading.dismiss();
        this.menu.enable(true);
        this.nav.setRoot(IndexPage);
      })
      .catch((d)=>{
        loading.dismiss();
        this.showError(d);
      });
  }
  showError(msg){
    //console.log(msg)
    let alert = Alert.create({title: '登录错误', subTitle:msg , buttons: ["确定"]});
    this.nav.present(alert);
  }
  
}
