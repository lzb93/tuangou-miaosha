import { getMoreTeam } from '../../../services/API';
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
    isAgain: true,
    isNomore: false,
    p: 0
  },
  onLoad() {

  },
  onShow() {
    this.getMoreTeam({ p: this.data.p });
  },
  getMoreTeam(params) {
    getMoreTeam(params).then(({ status, result, msg }) => {
      if (status == 1) {
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
    this.getMoreTeam({ p: this.data.p })
  },
  shareTeam(e) {
    const index = e.currentTarget.dataset.index;
    const arr = this.data.items;
    const foundId = arr[index].found_id || arr[index].tfound_id
    wx.navigateTo({
      url: `/pages/TEAM/found/found?foundId=${foundId}&userId=${app.userInfo.user_id}`
    })
  },
  navigatorTeam(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/USER/orderDetail/orderDetail?id=${id}&type=team`
    })
  }
})