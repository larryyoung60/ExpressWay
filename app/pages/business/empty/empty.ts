import {NavController , NavParams} from 'ionic-angular';
import {Component} from '@angular/core';

@Component({
  templateUrl: 'build/pages/business/empty/empty.html',
})
export class EmptyPage {
  
  private currentMenu:any;
  
  constructor(private nav: NavController , private navParams:NavParams) {
    this.currentMenu = this.navParams.get("menu");
  }
}
