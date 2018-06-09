import { search } from '../../../services/API';
import { dalay } from '../../../utils/utils'

const app = getApp();
Page({
  data: {
    http: app.http,
    host: app.host,
    p: 1,
    items: [],
    isAgain: true,
    isNomore: false
  },
  onLoad(options) {
    this.setData({
      keyword: options.keyword
    })
    this.search({ q: options.keyword, p: this.data.p })
  },
  search(params) {
    search(params).then(({ status, result, msg }) => {
      if (status == 1) {
        const items = result.goods_list || [];
        const arr = this.data.items.concat(items);
        this.setData({
          items: arr,
          page: ++this.data.p,
          isAgain: true
        })
        this.finish(items);
      } else {
        app.wxAPI.alert(msg);
      }
    })
  },
  onReachBottom() {
    if (!dalay(1000)) return;
    if (!this.data.isAgain) return;
    this.setData({ isAgain: false });
    this.search({ q: this.data.keyword, p: this.data.p })
  },
  //结束处理
  finish(arr) {
    if (arr.length < 10) {
      this.setData({
        isAgain: false,
        isNomore: true
      })
    }
  }
})