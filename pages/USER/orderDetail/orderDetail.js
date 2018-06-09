import { getOrderDetail, cancelOrder, getExpress, orderConfirm } from '../../../services/API';
import { js_date_time } from '../../../utils/utils';

const app = getApp();
Page({
  data: {
    http: app.http,
    host: app.host,
    goods: '',
    from: '',
    buttons: '',
    order: '',
    orderTime: '',
    addTime: ''
  },
  onLoad(options) {
    const from = options.type;
    const id = options.id;
    if (from) {
      this.setData({
        from: options.type
      })
    }
    getOrderDetail({ id: id }).then(({ status, result, msg }) => {
      if (status == 1) {
        this.setData({
          goods: result.order_goods,
          buttons: result.order_button,
          order: result,
          orderTime: js_date_time(result.pay_time),
          addTime: js_date_time(result.add_time)
        })
      } else {
        app.wxAPI.alert(msg);
      }
    })
  },
  cancelOrder(e) {
    const order = this.data.order;
    const buttons = this.data.buttons;
    if (buttons.pay_btn) {
      app.wxAPI.confirm('确定取消订单吗？')
        .then(() => {
          return cancelOrder({ order_id: order.order_id });
        })
        .then(({ status, result, msg }) => {
          if (status === 1) {
            app.wxAPI.toast("取消成功");
            const type = this.data.activeType;
            this.tabNavBar(type);
          } else {
            app.wxAPI.alert(msg)
          }
        })
    } else {
      app.cancelOrder = order;
      wx.navigateTo({
        url: `/pages/USER/orderCancel/orderCancel`
      })
    }
  },
  lookExpress(e) {
    const id = e.currentTarget.dataset.id;
    getExpress({ order_id: id })
      .then(({ status, result, msg }) => {
        if (status == 1) {
          wx.navigateTo({
            url: `/pages/USER/logistic/logistic?no=${result.invoice_no}&code=${result.shipping_code}`
          })
        }
      })
  },
  confirm(e) {
    const order_id = e.currentTarget.dataset.order_id;
    app.wxAPI.confirm('确定收货吗？')
      .then(() => {
        return orderConfirm({ order_id })
      })
      .then(({ status, result, msg }) => {
        if (status === 1) {
          // 输入支付密码
          this.onShow()
          app.wxAPI.toast("确认收货成功")
          wx.navigateBack({
            delta: 1
          })
        } else {
          app.wxAPI.alert(msg)
        }
      })
  },
  comment(e) {
    app.cancelOrder = this.data.order;
    wx.navigateTo({
      url: `/pages/USER/pinglun/pinglun`
    })
  },
  saleAfter(e) {
    app.cancelOrder = this.data.order;
    wx.navigateTo({
      url: `/pages/USER/returnGoods/returnGoods`
    })
  }
})