import { refundOrderList } from '../../../services/API';
import { dalay } from '../../../utils/utils'

const app = getApp();
Page({
  data: {
    http: app.http,
    host: app.host,
    items: [],
    page: 0,
    isAgain: false,
    isNomore: true,
    status: [
      {
        id: 1,
        name: '待处理'
      },
      {
        id: 3,
        name: '已退款'
      },
      {
        id: 4,
        name: '已拒绝'
      }
    ]
  },
  onLoad() {
    this.refundOrderList({ page: this.data.page })
  },
  refundOrderList(params) {
    refundOrderList(params).then(({ status, result, msg }) => {
      if (status == 1) {
        let items = this.data.items;
        (result || []).forEach(item => {
          const state = this.data.status.find(type => {
            return type.id == item.pay_status;
          })
          item.statusName = state.name;
        })
        this.setData({
          items: items.concat(result),
          page: ++this.data.page,
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
    if (!dalay(1000)) return;
    if (!this.data.isAgain) return;
    this.setData({ isAgain: false });
    this.refundOrderList({ page: this.data.page });
  },
  navigatorDetail(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/USER/orderDetail/orderDetail?id=${id}`
    })
  }
})