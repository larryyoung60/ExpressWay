import {NavController,NavParams, Events, Loading, Toast,} from 'ionic-angular';
import {DatabaseService} from '../../../../providers/database-service';
import {Component,wtfStartTimeRange,wtfEndTimeRange} from '@angular/core';
import {HttpService} from '../../service/HttpService';
import {DyProject} from '../project/DyProject';
import {DyTrouble} from '../trouble/DyTrouble';
import {DyProcess} from '../process/DyProcess';
import {AddProcess} from '../process/AddProcess';
import {PhotoAlbumModal} from '../../../../pages/common/photo-album-modal/photo-album-modal'


@Component ({templateUrl:"build/pages/build/dynamic/trouble/troubletab.html"})
export class TroubleTab {

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

   


    constructor(private httpserve:HttpService,
                private nav: NavController,
                private navParams:NavParams,
                private events: Events)
    {

        this.dyParams = {"data":navParams.get("project") , nav:this.nav,"medias":[]};
        this.addprocess = DyTrouble;
        this.photo = PhotoAlbumModal;
         this.dyproject = DyProject;
        this.dyprocess = DyProcess;
 
    }

    Save()
    {
        

        var  files:any[] = [];
        this.dyParams.files = files;
        var  stepcnt:number=0;
        var paras:any ={}; 
         paras.trouble = this.dyParams.trouble;
        paras.trouble.stepcnt =0;
        paras.trouble.cnt =this.dyParams.medias.length
        var questions = [];
        var item = {ques_content:"",filelist:[]}
        item.ques_content=this.dyParams.trouble.ques_content;
        questions.push(item);


        if(paras.trouble.trou_desc == "")
        {
            alert("标题不能为空!")
            return;
        }
        if(paras.trouble.trou_type == "")
        {
            alert("问题类型不能为空!")
            return;
        }
        if(this.dyParams.medias.length == 0)
        {
            alert("请添加图片!")
            return;
        }
        paras.trouble.questions = questions;

        if(paras.trouble.loc==true)
        {
            if(paras.trouble.loc_type == "")
                paras.trouble.loc_type= "loc";
            else
              paras.trouble.loc_type+= ",loc";
        }
        if(paras.trouble.build==true)
        {
            if(paras.trouble.loc_type == "")
                paras.trouble.loc_type= "build";
            else
              paras.trouble.loc_type+= ",build";
        }
        if(paras.trouble.officer==true)
        {
            if(paras.trouble.loc_type == "")
                paras.trouble.loc_type= "officer";
            else
              paras.trouble.loc_type+= ",officer";
        }
        if(paras.trouble.survey==true)
        {
            if(paras.trouble.loc_type == "")
                paras.trouble.loc_type= "survey";
            else
              paras.trouble.loc_type+= ",survey";
        }
        if(paras.trouble.design==true)
        {
            if(paras.trouble.loc_type == "")
                paras.trouble.loc_type= "design";
            else
              paras.trouble.loc_type+= ",design";
        }

        paras.httpserve  = this.httpserve;



        this.loading =  Loading.create({
            content: "图片上传中!"
        });
       this.nav.present(this.loading);
       paras.loading = this.loading;
       paras.trouble.questions[0].filelist = [];



       
        var ft = new FileTransfer();

        for(var i = 0;i <this.dyParams.medias.length;i ++ )
       { 


            var paths = this.dyParams.medias[i].path.split('?');
         
            ft.upload(paths[0], encodeURI(HttpService.url+"api/FileUpload"), 
                function (response) {
                try{
                        var obj = JSON.parse(response.response);
                        paras.trouble.questions[0].filelist.push(obj[0]);
                        paras.trouble.stepcnt = paras.trouble.stepcnt+1;
                        if(paras.trouble.stepcnt == paras.trouble.cnt)
                        {   
                            paras.loading.dismiss();
                            paras.httpserve.SaveProjectTrouble(paras.trouble).then(res=>{
                                alert("保存成功！");

                            },function (error){
                                alert("a1"+JSON.stringify(error));
                                paras.loading.dismiss();

                            })
                        }     
                    }catch(error)
                    {
                         alert("a2"+JSON.stringify(error));
                        paras.loading.dismiss();
                    }
                }, 
                function (error) {
                        alert("a3"+JSON.stringify(error));
                        paras.loading.dismiss();
                }, paras);
       }
   

    }



}