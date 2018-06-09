import { teamList } from '../../../services/API';
import { dalay } from '../../../utils/utils'

const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    http: app.http,
    host: app.host,
    banners: [],
    products: [],
    page: 1,
    isAgain: true,
    isNomore: false,
  },
  onLoad() {
    this.getTeamList({ page: this.data.page });
  },
  onReachBottom() {
    if (!dalay(1000)) return;
    if (!this.data.isAgain) return;
    this.setData({ isAgain: false });
    this.getTeamList({ page: this.data.page });
  },
  getTeamList(params) {
    teamList({ p: this.data.page }).then(({ status, result, msg }) => {
      if (status == 1) {
        const products = result || [];
        const arr = this.data.products.concat(products);
        this.setData({
          products: arr,
          page: ++this.data.page,
          isAgain: true
        })
        this.finish(products);
      } else {
        app.wxAPI.alert(msg)
      }
    })
  },
  //结束处理
  finish(arr) {
    if (arr.length < 2) {
      this.setData({
        isAgain: false,
        isNomore: true
      })
    }
  },
  onShareAppMessage(res) {
    return {
      title: '拼团',
      path: '/pages/TEAM/team/team?userId=' + app.userInfo.user_id,
    }
  }
})