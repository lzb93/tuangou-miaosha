import { refundOrder } from '../../../services/API';

const app = getApp();
Page({
  data: {
    http: app.http,
    host: app.host,
    isShowReason: false,
    order: {},
    reasons: [
      {name: "订单不能按时送达", id: 0}, 
      {name: "操作有误(商品、地址等选错)", id: 1}, 
      {name: "重复下单/ 误下单", id: 2}, 
      {name: "其他渠道价格更低", id: 3}, 
      {name: "该商品降价了", id: 4}, 
      {name: "不想买了", id: 5}, 
      {name: "其他原因", id: 6}
    ],
    reason: {
      name: '请选择'
    }
  },
  onLoad(option) {
    this.setData({
      order: app.cancelOrder
    })
  },
  openPop(e) {
    this.setData({
      isShowReason: true
    })
  },
  closeReason() {
    this.setData({
      isShowReason: false
    })
  },
  selectReason(e) {
    const id = e.currentTarget.dataset.id;
    const arr = this.data.reasons;
    let reason = arr.find(item => {
      return item.id == id;
    })
    this.setData({
      reason,
      isShowReason: false
    })
  },
  submit() {
    const order = this.data.order;
    const reason = this.data.reason;
    if(!~reason.id) {
      app.wxAPI.alert('退款原因未选择!');
      return;
    }
    let params = {
      order_id: order.order_id,
      user_note: reason.name,
      consignee: order.consignee,
      mobile: order.mobile,
      remark: order.remark || ''
    }
    refundOrder(params).then(({status, result, msg}) => {
      if(status == 1) {
        app.wxAPI.toast(msg);
        wx.navigateBack({
          delta: 2
        })
      } else {
        app.wxAPI.alert(msg)
      }
    })
  },
  bindTextAreaBlur(e) {
    let order = this.data.order;
    order.remark = e.detail.value;
  }
})