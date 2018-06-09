import { getGoodsComment } from '../../../services/API';
import { js_date_time } from '../../../utils/utils';
import { dalay } from '../../../utils/utils'

const app = getApp();
Page({
  data: {
    http: app.http,
    host: app.host,
    comments: [],
    navs: [
      {
        id: 'total_sum',
        type: '1',
        name: '全部评价'
      },
      {
        id: 'high_sum',
        type: '2',
        name: '好评'
      },
      {
        id: 'center_sum',
        type: '3',
        name: '中评'
      },
      {
        id: 'low_sum',
        type: '4',
        name: '差评'
      },
      {
        id: 'img_sum',
        type: '5',
        name: '有图'
      }
    ],
    navType: '1',
    p: 0,
    isAgain: true,
    isNomore: false,
    goodsId: '',
    statistics: ''
  },
  onLoad(e) {
    const goodsId = e.id;
    this.setData({ goodsId });
    const statistics = app.statistics || {};
    const navs = this.data.navs;
    let arr = navs.map((item, key) => {
      return {
        type: key + 1,
        name: item.name,
        sum: statistics[item.id]
      }
    })
    this.setData({
      navs: arr
    })
    this.getGoodsComment({goods_id: goodsId, p: this.data.p, type: this.data.navType});
  },
  getGoodsComment(params) {
    getGoodsComment(params).then(({ status, result, msg }) => {
      if(status == 1) {
        const comments = (result || []).map(item => {
          return {
            add_time: js_date_time(item.add_time),
            content: item.content,
            username: item.username,
            head_pic: item.head_pic,
            img: item.img
          }
        })
        this.setData({
          comments: comments,
          p: ++this.data.p,
          isAgain: true
        })
        this.finish(result);
      }
    })
  },
  tabNavBar(e) {
    const type = e.currentTarget.dataset.type;
    this.reset();
    dalay(500); // 防止触发 到底
    this.setData({ navType: type });
    this.getGoodsComment({ goods_id: this.data.goodsId, p: this.data.p, type: this.data.navType });
  },
  onReachBottom() {
    if (!dalay(1000)) return;
    if (!this.data.isAgain) return;
    this.setData({ isAgain: false });
    this.getGoodsComment({ goods_id: this.data.goodsId, p: this.data.p, type: this.data.navType });
  },
  reset() {
    this.setData({
      comments: [],
      p: 0,
      isAgain: true,
      isNomore: false
    })
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