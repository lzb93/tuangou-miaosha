import { killTime, killData } from '../../../services/API'

const app = getApp();
Page({
  data: {
    http: app.http,
    host: app.host,
    p: 0,
    active: 0,
    isAgain: true,
    isNomore: false,
    navs: [],
    items: []
  },
  onLoad() {
    killTime()
      .then(({ status, result, msg }) => {
        if(status == 1) {
          this.setData({
            active: 0,
            navs: result.time
          })
          this.killData({ start_time: result.time[0].start_time, end_time: result.time[0].end_time, p: this.data.p });
        } else {
          app.wxAPI.alert(msg);
        }
      })
  },
  killData(params) {
    killData(params)
      .then(({ status, result, msg }) => {
        if(status == 1) {
          const items = this.data.items;
          this.setData({
            items: items.concat(result),
            p: ++this.data.p,
            isAgain: true
          })
          this.finish(result);
        }
      })
  },
  onReachBottom() {
    if (!this.data.isAgain) return;
    this.setData({ isAgain: false });
    const navs = this.data.navs;
    const index = this.data.active;
    this.killData({ start_time: navs[index].start_time, end_time: navs[index].end_time, p: this.data.p });
  },
  switchTab(e) {
    const index = e.currentTarget.dataset.index;
    const navs = this.data.navs;
    this.reset();
    this.killData({ start_time: navs[index].start_time, end_time: navs[index].end_time, p: this.data.p })
    this.setData({
      active: index
    })
  },
  //重置函数
  reset() {
    this.setData({
      items: [],
      p: 0,
      isAgain: true,
      isNomore: false,
    })
  },
  //判断是否结束
  finish(arr) {
    if (arr.length < 10) {
      this.setData({
        isAgain: false,
        isNomore: true
      })
    }
  },
  urlDetail(e) {
    const index = this.data.active;
    const id = e.currentTarget.dataset.id;
    const itemId = e.currentTarget.dataset.itemId;
    if(index == 0) {
      wx.navigateTo({
        url: `/pages/KILL/detail/detail?id=${id}&itemId=${itemId}`
      })
    }
  }
})