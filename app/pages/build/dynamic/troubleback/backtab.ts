import {NavController,NavParams, Events, Loading, Toast,} from 'ionic-angular';
import {DatabaseService} from '../../../../providers/database-service';
import {Component,wtfStartTimeRange,wtfEndTimeRange} from '@angular/core';
import {HttpService} from '../../service/HttpService';
import {DyProject} from '../project/DyProject';
import {Trouble} from '../troubleback/Trouble';
import {TroubleInfo} from '../troubleback/trouinfo';
import {DyProcess} from '../process/DyProcess';
import {AddProcess} from '../process/AddProcess';
import {PhotoAlbumModal} from '../../../../pages/common/photo-album-modal/photo-album-modal';
import {DynamicList} from '../DynamicList';

@Component ({templateUrl:"build/pages/build/dynamic/troubleback/backtab.html"})
export class BackTab {

    private project:any;
    private title:string;


    private trouble:any;
    private photo:any;
    private troubleinfo:any;

    private dyParams:any;
    private cnt:number = 0;
    private files:any[] = [];
    private loading:any;
    private ques:any[]=[];
    private projectid:any;
 


    constructor(private httpserve:HttpService,
                private nav: NavController,
                private navParams:NavParams,
                private events: Events)
    {

        this.dyParams = {"data":navParams.get("trouble") , nav:this.nav,"medias":[]};
        this.trouble = Trouble;
        this.photo = PhotoAlbumModal;
        this.troubleinfo = TroubleInfo;

        this.projectid = navParams.get("trouble").project_id;
        var trou_id =  navParams.get("trouble").trou_id

        httpserve.GetTrouble(this.projectid, trou_id).then(res=>this.ques= res.questions);


    }

    Save()
    {
        
      //  {"trou_id":24,"type":"","resolve":"dfsfsf","cur_status":"已处理","questions":[{"ques_id":24,"filelist":["eeae9d02-8277-47b1-8ab5-b20ca8f08c10.jpg"]}]}
      
        if(this.ques.length>0)
        {
            this.dyParams.tjdata.questions=[{ques_id:this.ques[0].ques_id,filelist:[]}];
        }
      
        if( this.dyParams.tjdata.resolve == "" || this.dyParams.tjdata.resolve == undefined)
        {
            alert("请填写反馈内容!")
            return;
        }
        if(this.dyParams.tjdata.cur_status== -1)
        {
            alert("请选择反馈状态!")
            return;
        }
        if( this.dyParams.tjdata.cur_status == 0)
            this.dyParams.tjdata.cur_status = "已处理";
        else
            this.dyParams.tjdata.cur_status = "已完成";

        if(this.dyParams.medias.length==0)
        {
            alert("请选择图像文件!")
            return 
        }


        this.dyParams.tjdata.stepcnt=0;
        this.dyParams.tjdata.cnt=this.dyParams.medias.length;
        var paras:any = {};
         paras.tjdata = this.dyParams.tjdata;
         paras.tjdata.project_id = this.projectid;
         paras.httpserve  = this.httpserve

        this.loading =  Loading.create({
            content: "图片上传中!"  
        });
 
       this.nav.present(this.loading);
       paras.loading = this.loading;

       var ft = new FileTransfer();
       var cnt = this.dyParams.medias.length;
       for(var i = 0;i <cnt;i ++ )
       { 
            var paths = this.dyParams.medias[i].path.split('?');
            ft.upload(paths[0], encodeURI(HttpService.url+"/api/FileUpload"), 
                function (response) {
                    try {
     
                        var obj = JSON.parse(response.response);
                        paras.tjdata.questions[0].filelist.push(obj[0]);
                        paras.tjdata.stepcnt = paras.tjdata.stepcnt+1;
                        if(paras.tjdata.stepcnt == paras.tjdata.cnt)
                        {   

      
                            paras.httpserve.SaveTrouble(paras.tjdata).then(res=>{
                                            
                                    alert("保存成功！");
                                    paras.loading.dismiss();

                                },function (error){
                                        alert("1")

                                    alert(JSON.stringify(error));
                                    paras.loading.dismiss();

                                });
                        }
                    }
                    catch(error)
                    {
                             alert("12")
                        
                             alert(JSON.stringify(error));
                   
                        paras.loading.dismiss();
                    }
                }, 
                function (error) {
                  
                             alert("13")
                        alert(JSON.stringify(error));
                    paras.loading.dismiss();
                }, paras);
       }
    }
}