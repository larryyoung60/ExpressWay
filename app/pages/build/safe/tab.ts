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
import * as _ from 'lodash';

@Component ({templateUrl:'build/pages/build/safe/tab.html'})

export class SafeTabs {
    
    private m_http:any;
    private dyParams:any;

    private safe_id:any;
    private safeinfo:any;

    private mainpage:any;
    private addsafe:any;
    private photo:any;
    private loading:any;

    private nodes:any;
    protected medias: any[] = [];
    protected oldMedias: any[] = [];    
    public infoParams:any = {
        title: "安全检查信息" , 
        icon:"information-circle"
    };


    constructor( events: Events,
               
                private  httpserve:HttpService,
                 private nav: NavController,
                 private navParams:NavParams,
                  private resource: Resource,
                 dbService:DatabaseService)
    {
        //super(events , nav , navParams , SafeModel);  
         this.dyParams = {"data":navParams.data , nav:this.nav,"medias":[]};
        //this.dyParams = {"data":navParams.data , nav:this.nav};
        
        this.mainpage = MainPage;
        this.addsafe = AddSafe;
        this.photo = PhotoAlbumModal;
        
       
    }
    initPageOptions()
    {

    }
    
    Save()
    {

        var  stepcnt:number=0;
       this.dyParams.result.stepcnt=0;
        this.dyParams.result.cnt=this.dyParams.medias.length
        
        for(var i =0 ; i <this.dyParams.result.ques.length;i++)
        {
            if(i==0)
                this.dyParams.result.check_item+= this.dyParams.result.ques[i].item_id;
            else
                this.dyParams.result.check_item+=","+ this.dyParams.result.ques[i].item_id;
        }
        var paras = this.dyParams.result;
        paras.safe_id = this.dyParams.data.safe_id;
        paras.httpserve  = this.httpserve
 



        this.loading =  Loading.create({
            content: "图片上传中!"
        });
       this.nav.present(this.loading);
       paras.loading = this.loading;
       paras.filelist = [];

        var ft = new FileTransfer();

        for(var i = 0;i <this.dyParams.medias.length;i ++ )
        { 
            var paths = this.dyParams.medias[i].path.split('?');

            ft.upload(paths[0], encodeURI(HttpService.url+"api/FileUpload"), 
                    function (response) {

                    var obj = JSON.parse(response.response)
                    paras.filelist.push(obj[0]);
                    paras.stepcnt = paras.stepcnt+1;
                    if(paras.stepcnt == paras.cnt)
                    {   
                         paras.loading.dismiss();
                        var subjson = {check_item:paras.check_item,
                            cur_status:paras.cur_status,
                            filelist: paras.filelist,
                            fill_type:paras.fill_type,
                            isok:paras.isok,
                            loc_content:paras.loc_content,
                            loc_id:paras.loc_id,
                            sc_id:paras.sc_id,
                            safe_id:paras.safe_id
                            
                        }
                        paras.httpserve.SaveSafeCompany(subjson).then(res=>{
                                alert("保存成功！");
                           paras.loading.present();
                        

                        })
                    }
                

                    }, 
                    function (err) {
                        paras.loading.present();
                        alert("失败！");
                    }, paras);
        }

     
    }

}

