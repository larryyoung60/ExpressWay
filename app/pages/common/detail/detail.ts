import {NavController, List, NavParams, ItemSliding, Modal, Alert} from 'ionic-angular';
import {Component, ViewChild} from '@angular/core';
import {CommonDetailModel} from '../../../models/common-detail-model';
import {CommonDetailFormPage} from './form';

@Component({
  templateUrl: 'build/pages/common/detail/detail.html',
})
export class CommonDetailPage {
  @ViewChild(List) listRef: List;

  items: CommonDetailModel[];
  detailParams: any;
  parentResult: any;

  constructor(
    private nav: NavController,
    private navParams: NavParams
  ) {
    this.detailParams = this.navParams.data;
    this.items = this.navParams.get("detail") || [];
    this.parentResult = this.navParams.get("result") || {};
    setTimeout(() => {
      this.listRef.enableSlidingItems(this.detailParams.enableSliding);
    }, 10)
  }
  /** 清空 */
  removeAll() {
    let confirm = Alert.create({
      title: '清空确认?',
      message: '确认要清空所有记录么?',
      buttons: [
        { text: '取消' },
        {
          text: '确认清空',
          handler: () => {
            confirm.dismiss().then(() => {
              this.items.splice(0, this.items.length);
            });
            return false;
          }
        }
      ]
    });
    this.nav.present(confirm);

  }
  /** 打开表单 */
  openForm(item: CommonDetailModel, action) {
    let modal = Modal.create(CommonDetailFormPage, {
      item: item,
      items: this.items,
      isEditing: action == "edit",
      title: (action == "edit" ? "修改" : "添加") + this.detailParams.title
    });
    /*
    modal.onDismiss(data => {
      if (!data) return;
      var record = _.find(this.items , {"id":data.id});
      if (!record){
        this.items.push(data);
      }
   });
   */
    return this.nav.present(modal);
    //return this.nav.push(MinorRepairDetailFormPage , {item:item});
  }
  add() {
    var item = new CommonDetailModel();
    item.set({
      catalog: this.parentResult.catalog
    });
    this.openForm(item, "add");
  }
  edit(item, slidingItem: ItemSliding) {
    this.openForm(item, "edit").then(() => {
      slidingItem.close();
    });
  }
  delete(item, slidingItem: ItemSliding) {
    let confirm = Alert.create({
      title: '删除确认?',
      message: '确认要删除该记录么?',
      buttons: [
        { text: '取消' },
        {
          text: '确认删除',
          handler: () => {
            confirm.dismiss().then(() => {
              this.items.splice(_.indexOf(this.items , item) , 1);
              slidingItem.close();
            });
            return false;
          }
        }
      ]
    });
    this.nav.present(confirm);
  }

}
