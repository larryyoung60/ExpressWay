import {NavController,NavParams, Events, Loading, Toast,} from 'ionic-angular';
import {DatabaseService} from '../../../../providers/database-service';
import {Component,wtfStartTimeRange,wtfEndTimeRange} from '@angular/core';
import {HttpService} from '../../service/HttpService';
import {DyProject} from '../project/DyProject';
import {DyTrouble} from '../trouble/DyTrouble';
import {DyProcess} from '../process/DyProcess';
import {AddProcess} from '../process/AddProcess';
import {PhotoAlbumModal} from '../../../../pages/common/photo-album-modal/photo-album-modal';
import {DynamicList} from '../DynamicList';

@Component ({templateUrl:"build/pages/build/dynamic/detail/detail.html"})
export class Detail {

    private project:any;
    private title:string;


    private dyproject:any;
    private photo:any;
    private dyprocess:any;
    private addprocess:any;

    private dyParams:any;
    private cnt:number = 0;
    private files:any[] = [];
    private loading:any;
   // private paras:any={};
 


    constructor(private httpserve:HttpService,
                private nav: NavController,
                private navParams:NavParams,
                private events: Events)
    {

        this.dyParams = {"data":navParams.get("project") , nav:this.nav,"medias":[]};
        this.dyproject = DyProject;
        this.photo = PhotoAlbumModal;
        this.dyprocess = DyProcess;
        this.addprocess = AddProcess;
    }

    Save()
    {
        
        if(this.dyParams.process.pnode_id==0 || this.dyParams.process.pnode_id== undefined)
        {
            alert("请选择工程节点!")
            return 
        }
         if(this.dyParams.process.act_process==0 || this.dyParams.process.act_process== undefined)
        {
            alert("请填写当前进度!")
            return 
        }
        if(this.dyParams.medias.length==0)
        {
            alert("请选择图像文件!")
            return 
        }
        var  files:any[] = [];
        this.dyParams.process.files = files;
        var  stepcnt:number=0;
         this.dyParams.process.stepcnt=0;
        this.dyParams.process.cnt=this.dyParams.medias.length;
        var paras:any = {};
         paras.process = this.dyParams.process;
        paras.httpserve  = this.httpserve

        this.loading =  Loading.create({
            content: "图片上传中!"  
        });
 
       this.nav.present(this.loading);

       paras.loading = this.loading;
 
       paras.process.filelist = [];

        var ft = new FileTransfer();
        var cnt = this.dyParams.medias.length;
        for(var i = 0;i <cnt;i ++ )
       { 
            var paths = this.dyParams.medias[i].path.split('?');
            ft.upload(paths[0], encodeURI(HttpService.url+"/api/FileUpload"), 
                function (response) {
                    try {
                        var obj = JSON.parse(response.response);
                        paras.process.filelist.push(obj[0]);
                        paras.process.stepcnt = paras.process.stepcnt+1;
                        if(paras.process.stepcnt == paras.process.cnt)
                        {   

                            paras.loading.dismiss();
                            paras.httpserve.SaveCurProcess(paras.process).then(res=>{
                                            
                                    alert("保存成功！");

                                },function (error){
                                        alert(error);
                                        paras.loading.dismiss();

                                });
                        }
                    }
                    catch(error)
                    {
                        alert(error);
                        paras.loading.dismiss();
                    }
                }, 
                function (err) {
                    alert("失败！");
                    paras.loading.dismiss();
                }, paras);
       }

    }




}