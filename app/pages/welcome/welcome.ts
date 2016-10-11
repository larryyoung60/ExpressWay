import {NavController, MenuController} from 'ionic-angular';
import {Component} from '@angular/core';
import {IndexPage} from '../business/index/index';
import {LoginPage} from '../login/login';


@Component({
  templateUrl: 'build/pages/welcome/welcome.html'
})
export class WelcomePage {

  private showSkip: boolean = true;
  private slides: { title: string; description: string; image: string }[] = [
    {
      title: "欢迎使用动态项目管理系统",
      description: "动态项目管理系统,这里是我的说明,四个字,就是好用!",
      image: "img/ica-slidebox-img-1.png",
    },
    {
      title: "移动端,更便利",
      description: "兼容所有移动端",
      image: "img/ica-slidebox-img-2.png",
    },
    {
      title: "图片,视频,音频",
      description: "多种扩展,病害信息更丰富",
      image: "img/ica-slidebox-img-3.png",
    }
  ];

  constructor(private nav: NavController, private menu: MenuController) { }

  startApp() {
    this.nav.setRoot(LoginPage);
  }

  onSlideChangeStart(slider) {
    this.showSkip = !slider.isEnd;
  }

  ionViewDidEnter() {
    // the left menu should be disabled on the tutorial page
    this.menu.enable(false);
  }

  ionViewDidLeave() {
    // enable the left menu when leaving the tutorial page
    this.menu.enable(true);
  }

}
