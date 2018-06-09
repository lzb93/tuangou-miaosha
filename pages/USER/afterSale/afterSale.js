import { returnGoods } from '../../../services/API';
import { uploadFile } from '../../../utils/request'

const app = getApp();
Page({
  data: {
    host: app.host,
    http: app.http,
    titles: ["申请退款", "申请退款", "申请换货", "申请维修"],
    type: '',
    order: '',
    imgs: [],
    reasons: [
      {
        id: 0,
        name: '质量问题'
      }, 
      {
        id: 1,
        name: "收到商品少件/破损/污渍等"
      }, 
      {
        id: 2,
        name: "其他"
      }
    ],
    reason: {name: '请选择'}
  },
  onLoad(option) {
    const type = option.type;
    this.setData({
      type,
      order: app.cancelOrder
    })
    wx.setNavigationBarTitle({ title: this.data.titles[type] })
  },
  selectReason(e) {
    
    const _this = this;
    const reasons = this.data.reasons;
    wx.showActionSheet({
      itemList: reasons.map(({ name }) => name),
      success({ tapIndex }) {
        if (typeof tapIndex == 'number') {
          _this.setData({ reason: reasons[tapIndex] })
        }
      }
    })
  },
  bindTextAreaBlur(e) {
    let order = this.data.order;
    order.describe = e.detail.value;
  },
  // chooseImage() {
  //   app.wxAPI.chooseImage({num: 9})
  //     .then(({ tempFiles }) => {
  //       const arr = [];
  //       const length = tempFiles.length;
  //       for (let i = 0; i < length; i++) {
  //         uploadFile(app.host + 'c=User&a=uploadImg', tempFiles[i]).then(res => {
  //           if (JSON.parse(res).status == 1) {
  //             arr.push(JSON.parse(res).result);
  //             if (arr.length == length) {
  //               this.setData({
  //                 imgs: arr
  //               })
  //             }
  //           }
  //         })
  //       }
  //     })
  //     .catch(e => {
  //       app.wxAPI.alert(e)
  //     })
  // },
  submit() { 
    const order = this.data.order;
    const goods = order.order_goods[0];
    if(!this.data.reason.id) {
      app.wxAPI.alert("原因未选择!");
      return;
    }
    let params = {
      rec_id: goods.rec_id,
      goods_id: goods.goods_id,
      order_sn: order.order_sn,
      order_id: order.order_id,
      spec_key: goods.spec_key,
      goods_num: goods.goods_num,
      type: this.data.type,
      reason: this.data.reason.name,
      describe: order.describe || '',
      return_imgs: this.data.imgs
    }
    returnGoods(params).then(({status, result, msg}) => {
      if(status == 1) {
        app.wxAPI.toast(msg);
        wx.navigateBack({
          delta: 2
        })
      } else {
        app.wxAPI.alert(msg);
      }
    })
  }
})