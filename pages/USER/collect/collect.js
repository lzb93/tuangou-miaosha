import { getGoodsCollect, collectGoods } from '../../../services/API';
import { dalay } from '../../../utils/utils'

const app = getApp();
Page({
  data: {
    http: app.http,
    host: app.host,
    items: [],
    p: 0,
    isAgain: true,
    isNomore: false,
  },
  onLoad() {
    this.goodsCollect();
  },
  goodsCollect(params) {
    getGoodsCollect(params).then(({status, result, msg}) => {
      if (status == 1) {
        const products = result || [];
        const arr = this.data.items.concat(products);
        this.setData({
          items: arr,
          p: ++this.data.p,
          isAgain: true
        })
        this.finish(products);
      } else {
        app.wxAPI.alert(msg)
      }
    })
  },
  onReachBottom() {
    if (!dalay(1000)) return;
    if (!this.data.isAgain) return;
    this.setData({ isAgain: false });
    this.goodsCollect({ p: this.data.p });
  },
  //结束处理
  finish(arr) {
    if (arr.length < 10) {
      this.setData({
        isAgain: false,
        isNomore: true
      })
    }
  },
  collectFn(e) {
    const index = e.currentTarget.dataset.index;
    const arr = this.data.items;
    const type = arr[index].is_on_sale ? 0 : 1
    const goods_id = arr[index].goods_id
    collectGoods({
      goods_id: goods_id,
      type: type,
      user_id: app.userInfo.user_id
    })
    .then(({ status, result, msg }) => {
      if (status === 1) {
        arr[index].is_on_sale = type
        this.setData({ items: arr })
      } else {
        app.wxAPI.alert(msg)
      }
    })
  },
  openDetail(e) {
    const index = e.currentTarget.dataset.index;
    const arr = this.data.items;
    wx.navigateTo({
      url: '/pages/KILL/detail/detail?id=' + arr[index].goods_id
    })
  }
})