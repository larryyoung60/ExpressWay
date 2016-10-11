import {NavController, NavParams, ActionSheet , ViewController, Platform, Modal} from 'ionic-angular';
import {Component} from '@angular/core';
import {Camera} from 'ionic-native';
import * as _ from 'lodash';
import * as moment from 'moment';

import {SettingService} from '../../../providers/setting-service';

import {PhotoPreviewModal} from '../photo-preview-modal/photo-preview-modal';


@Component({
  templateUrl: 'build/pages/common/photo-album-modal/photo-album-modal.html',
})
export class PhotoAlbumModal {

  private medias: any[];
  private oldMedias: any[] = [];

  private mediaParams;


  constructor(
    private platform: Platform,
    private nav: NavController,
    private navParams: NavParams,
    private viewCtrl: ViewController,
    private settingService: SettingService
  ) {
    this.mediaParams = this.navParams.data;    
    this.medias = this.navParams.get("medias") || [];
    this.oldMedias = this.navParams.get("oldMedias") || [];
    this.nav = this.navParams.get("nav");
    //console.log(this.navParams)
  }

  //清空
  removeAll() {
    this.medias.splice(0, this.medias.length);
  }

  //关闭modal
  dismiss() {
    this.viewCtrl.dismiss(this.medias);
  }

  getSettingPhotoSize() {
    var size = this.settingService.get("photoSize").split("x");
    return { w: size[0], h: size[1] };
  }

  showMenu() {
    let actionSheet = ActionSheet.create({
      cssClass:"hmenus" , 
      buttons: [
        {icon:"albums" ,text: '相册获取' , handler:() =>this.capturePhotoFromAlbum()},
        {icon:"mic" ,text: '录音'},
        {icon:"videocam" ,text: '摄像' , cssClass:"videocam"},
        {icon:"camera" ,text: '拍照',cssClass:"camera" , handler:()=>this.capturePhotoFromCamera()}
      ]
    });

    this.nav.present(actionSheet);
  }

  //从相册获取
  capturePhotoFromAlbum() {
    var wh = this.getSettingPhotoSize();
    var options = {
      targetWidth: wh.w,
      targetHeight: wh.h,
      quality: this.settingService.get("photoQuality"),
      sourceType: Camera.PictureSourceType.SAVEDPHOTOALBUM
    };
    Camera.getPicture(options).then((path) => {
      console.log(path);
      //从相册中获取,可能会带一个 ?xxxx , xxx是时间戳 , 还不知道原因
      path = path.split("?")[0];
      this.medias.push({
        reportTime: moment().format("YYYY-MM-DD HH:mm:ss") ,
        ix: this.medias.length + 1,
        path: path ,
        type:"image"
      });
    }, (err) => {

    });
  }

  //从相机拍照
  capturePhotoFromCamera() {
    var wh = this.getSettingPhotoSize();
    var options = {
      quality: this.settingService.get("photoQuality"),
      targetWidth: wh.w,
      targetHeight: wh.h,
      //destinationType: isIOS ? Camera.DestinationType.NATIVE_URI : Camera.DestinationType.FILE_URI,
      saveToPhotoAlbum: this.settingService.get("photoSaveToAlbum")
    };
    Camera.getPicture(options).then((path) => {
      this.medias.push({
        reportTime: moment().format("YYYY-MM-DD HH:mm:ss") ,
        ix: this.medias.length + 1 ,
        path: path , 
        type:"image"
      });
    }, (err) => {

    });
  }

  /**录取视频 */
  captureVideo(){
    navigator.device.capture.captureVideo(
      (files)=>{
        var file = files[0];
        var media = { path: file.fullPath, type: "video" , ix:this.medias.length+1};
        this.medias.push(media);
      } , 
      (err)=>{

      }
    );
  }

  /**录制音频 */
  captureAudio(){
    navigator.device.capture.captureAudio(
      (files)=>{
        var file = files[0];
        var media = { path: file.fullPath, type: "video" , ix:this.medias.length+1};
        this.medias.push(media);
      } , 
      (err)=>{

      }
    );
  }

  openOldPrevModal(media) {
    var index = _.findIndex(this.oldMedias, { "path": media.path });
    if (index == -1) return;
    this.nav.push(PhotoPreviewModal, { 
      currentIndex: index, 
      medias: this.oldMedias, 
      allowDelete: false, 
      mediaTitle: this.mediaParams.oldTitle 
    });
  }


  //打开图片预览
  openPreviewModal(media) {
    //获取media的index
    var index = _.findIndex(this.medias, { "ix": media.ix, "path": media.path });
    if (index == -1) return;
    this.nav.push(PhotoPreviewModal, { 
      currentIndex: index, 
      medias: this.medias, 
      allowDelete: true, 
      mediaTitle: this.mediaParams.title 
    });
    /*    
    var photoPreviewModal = Modal.create(PhotoPreviewModal, { currentIndex:index , medias: this.medias });
    photoPreviewModal.onDismiss(data => {
      this.medias = data || [];
    });
    this.nav.present(photoPreviewModal);
    */
  }

}


