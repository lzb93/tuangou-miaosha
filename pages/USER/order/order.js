import { getOrderList, orderConfirm, cancelOrder, returnGodds, getExpress, getQueryExpress } from '../../../services/API';
import { dalay } from '../../../utils/utils'

const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    http: app.http,
    host: app.host,
    items: [],
    navs: [
      {
        title: '全部',
        type: 'ALL',
        id: ''
      },
      {
        title: '待付款',
        type: 'WAITPAY',
        id: 0
      },
      {
        title: '待发货',
        type: 'WAITSEND',
        id: 1
      },
      {
        title: '待收货',
        type: 'WAITRECEIVE',
        id: 2
      },
      {
        title: '待评论',
        type: 'WAITCCOMMENT',
        id: 3
      }
    ],
    activeType: 'All',
    activeId: '',
    isAgain: true,
    isNomore: false,
    p: 1
  },
  onLoad(e) {
    const type = e.type;
    this.setData({
      activeType: type
    })
  },
  onShow() {
    const type = this.data.activeType;
    this.tabNavBar(type);
  },
  getOrderList (params) {
    getOrderList(params).then(({ status, result, msg }) => {
      if(status == 1) {
        let items = this.data.items
        this.setData({
          items: items.concat(result),
          p: ++this.data.p,
          isAgain: true
        })
        if (result.length < 10) {
          this.setData({
            isAgain: false,
            isNomore: true
          })
        }
      } else {
        app.wxAPI.alert(msg)
      }
    })
  },
  onReachBottom() {
    if (!dalay(500)) return
    if (!this.data.isAgain) return;
    this.setData({ isAgain: false });
    this.getOrderList({
      type: this.data.activeType,
      p: this.data.p,
    })
  },
  tabNavBar(e) {
    let type = ''
    if(typeof e === 'string') {
      type = e;
    } else {
      type = e.currentTarget.dataset.type;
    }
    this.reset();
    this.setData({ activeType: type })
    this.getOrderList({
      type: (type == 'All'?'':type),
      p: this.data.p,
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
        } else {
          app.wxAPI.alert(msg)
        }
      })
  },
  cancelOrder(e) {
    const index = e.currentTarget.dataset.index;
    const arr = this.data.items;
    if(arr[index].order_button.pay_btn) {
      app.wxAPI.confirm('确定取消订单吗？')
        .then(() => {
          return cancelOrder({ order_id: arr[index].order_id })
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
      app.cancelOrder = arr[index];
      wx.navigateTo({
        url: `/pages/USER/orderCancel/orderCancel`
      })
    }
  },
  navigatorDetail(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/USER/orderDetail/orderDetail?id=${id}`
    })
  },
  saleAfter(e) {
    const index = e.currentTarget.dataset.index;
    const arr = this.data.items;
    app.cancelOrder = arr[index];
    wx.navigateTo({
      url: `/pages/USER/returnGoods/returnGoods`
    })
  },
  comment(e) {
    const index = e.currentTarget.dataset.index;
    const arr = this.data.items;
    app.cancelOrder = arr[index];
    wx.navigateTo({
      url: `/pages/USER/pinglun/pinglun`
    })
  },
  lookExpress(e) {
    const id = e.currentTarget.dataset.id;
    getExpress({order_id: id})
      .then(({status, result, msg}) => {
        if(status == 1) {
          wx.navigateTo({
            url: `/pages/USER/logistic/logistic?no=${result.invoice_no}&code=${result.shipping_code}&name=${result.shipping_name}`
          })
        }
      })
  },
  reset() {
    this.setData({
      items: [],
      p: 1,
      activeType: 'All',
      isAgain: true,
      isNomore: false
    })
  }
})