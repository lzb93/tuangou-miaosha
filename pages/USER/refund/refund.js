import { refundGoodsList } from '../../../services/API';
import { dalay } from '../../../utils/utils'

const app = getApp();
Page({
  data: {
    http: app.http,
    host: app.host,
    items: [],
    p: 1,
    isAgain: false,
    isNomore: true,
    typeNames: [
      {
        name: "退货退款",
        id: 1
      },
      {
        name: "换货",
        id: 2
      },
      {
        name: "维修",
        id: 3
      }
    ],
    status: [
      {
        id: -2,
        name: '服务单已取消'
      },
      {
        id: -1,
        name: '审核失败'
      },
      {
        id: 0,
        name: '待审核'
      },
      {
        id: 1,
        name: '审核通过'
      },
      {
        id: 2,
        name: '买家发货'
      },
      {
        id: 3,
        name: '已收货'
      },
      {
        id: 4,
        name: '换货完成'
      },
      {
        id: 5,
        name: '退款完成'
      }
    ]
  },
  onLoad() {
    this.refundGoodsList({ p: this.data.p });
  },
  refundGoodsList(params) {
    refundGoodsList(params).then(({ status, result, msg }) => {
      if (status == 1) {
        let items = this.data.items;
        (result || []).forEach(item => {
          let statusDetail = this.data.status.find(type => {
            return type.id == item.status;
          })
          let type = this.data.typeNames.find(type => {
            return type.id == item.type;
          })
          item.typeName = type ? type.name : '';
          item.statusDetailName = statusDetail ? statusDetail.name : '';
        })
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
    if (!dalay(1000)) return;
    if (!this.data.isAgain) return;
    this.setData({ isAgain: false });
    this.refundGoodsList({ p: this.data.p });
  },
  navigatorDetail(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/USER/orderDetail/orderDetail?id=${id}`
    })
  }
})