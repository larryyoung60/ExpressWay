import {NavController,NavParams, Events, Loading, Toast} from 'ionic-angular';
import {DatabaseService} from '../../../providers/database-service';
import {Component} from '@angular/core';
import {GpsTrackService} from '../../../providers/gps-track-service';
import {Resource} from '../../../providers/resource';
import {HttpService} from '../service/HttpService';
import {PhotoAlbumModal} from '../../../pages/common/photo-album-modal/photo-album-modal';
import {PhotoPreviewModal} from '../../../pages/common/photo-preview-modal/photo-preview-modal';
import {SafeModel} from '../model/safemodel';
import {MainPage} from '../safe/mainpage';
import {AddSafe} from '../safe/addsafe';
import {RandomSafe} from '../safe/randomsafe'
import * as _ from 'lodash';
import {UserService} from '../../../providers/user-service';

@Component ({templateUrl:'build/pages/build/safe/emptytab.html'})

export class EmptyTab {
    
    private m_http:any;
    private dyParams:any;

    private safe_id:any;
    private safeinfo:any;

    private mainpage:any;
    private randompag:any;
    private photo:any;
    private loading:any;

    private nodes:any;  
    public infoParams:any = {
        title: "安全检查信息" , 
        icon:"information-circle"
    };


    constructor( events: Events,
                 private httpserve:HttpService,
                 private nav: NavController,
                 private navParams:NavParams,
                  private resource: Resource,
                 dbService:DatabaseService)
    {
        //super(events , nav , navParams , SafeModel);   
        this.dyParams = {"data":navParams.get("data") , nav:this.nav,"medias":[]};
   
        
        this.randompag = RandomSafe;
        this.photo = PhotoAlbumModal;
        
       
    }

    
    LoadProject(data)
    {
        this.nodes = data;

    }


    Save()
    {
        var result = this.dyParams.result ;

        var SafeCheckAllView:any =  {}
        var safeinfo:any ={};
        var safecheckperson:any= []
        var questions:any=[];
        var filelist:string[];

        questions.push({item_title:result.item_title,item_conten:result.item_content});
        safecheckperson.push({emp_id:UserService.StaticCurrent.user_id})

        SafeCheckAllView.safeinfo = result;
        SafeCheckAllView.safecheckperson =safecheckperson;
        SafeCheckAllView.questions = questions;
        SafeCheckAllView.filelist=[];

        if(result.title== ""|| result.title== undefined)
        {
            alert("标题不能为空!");
            return;
        }
        if(result.item_content== ""|| result.item_content== undefined)
        {
            alert("问题内容不能为空!");
            return;
        }

        if(result.item_title== ""|| result.item_title== undefined)
        {
            alert("问题简介不能为空!");
            return;
        }
        if(result.end_time== ""|| result.end_time== undefined)
        {
            alert("结束时间!");
            return;
        }
         if(result.plan_begin== ""|| result.plan_begin== undefined)
        {
            alert("开始时间!");
            return;
        }
        if(this.dyParams.medias.length==0)
        {
            alert("请选择照片!");
            return; 
        }
        SafeCheckAllView.safeinfo.checkno = "";
        SafeCheckAllView.safeinfo.check_type ="random";



        var paras:any ={};
        paras.result = SafeCheckAllView;
        paras.result.stepcnt = 0;
        paras.result.cnt = this.dyParams.medias.length;
        paras.httpserve = this.httpserve;
        
        this.loading =  Loading.create({
            content: "图片上传中!"
        });
       this.nav.present(this.loading);
       paras.loading = this.loading;


        var ft = new FileTransfer();
        for(var i = 0;i <this.dyParams.medias.length;i ++ )
       { 
            var paths = this.dyParams.medias[i].path.split('?');
            ft.upload(paths[0], encodeURI(HttpService.url+"api/FileUpload"), 
                function (response) {

                var obj = JSON.parse(response.response)

                paras.result.filelist.push(obj[0]);
                paras.result.stepcnt = paras.result.stepcnt+1;
      
                
                if(paras.result.stepcnt == paras.result.cnt)
                {   
                    paras.httpserve.SaveSafeCheckMessage(paras.result).then(res=>{
                      
                        paras.loading.dismiss();
                        alert("保存成功！");

                    })
                }

                }, 
                function (err) {
                        paras.loading.dismiss();
                        alert("失败！");

                }, paras);
       }
    
        this.dyParams.medias =[];
        

    }

}
