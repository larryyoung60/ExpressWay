import {NavController , NavParams, ViewController , Slides} from 'ionic-angular';
import {Component} from '@angular/core';
import {ViewChild} from '@angular/core';


@Component({
  templateUrl: 'build/pages/common/photo-preview-modal/photo-preview-modal.html'
})
export class PhotoPreviewModal {  
  @ViewChild('imageSlides') slides:Slides;
  
  private medias:any[];
  private mediaTitle:string = "";
  private currentIndex:number;
  private allowDelete:boolean = false;
  private mySlideOptions:Object;
  
  constructor(
    private nav:NavController , 
    private navParams:NavParams , 
    private viewCtrl:ViewController
  ) {       
    this.medias = this.navParams.get("medias");
    this.mediaTitle = this.navParams.get("mediaTitle");
    this.allowDelete = this.navParams.get("allowDelete");
    this.currentIndex = this.navParams.get("currentIndex");
    this.mySlideOptions = {
      initialSlide: this.currentIndex
    };
  }
  
  //关闭modal
  dismiss() {
    this.viewCtrl.dismiss(this.medias);
  }
  
  //slidechange
  onSlideChangeStart(){    
    this.currentIndex = this.slides.getActiveIndex();
  }
  
  //删除
  remove(){
    var slider = this.slides.getSlider();        
    slider.removeSlide(this.currentIndex);
    //console.log(this.medias)
    this.medias.splice(this.currentIndex , 1);
    //console.log(this.medias)
      
  }
  
}
