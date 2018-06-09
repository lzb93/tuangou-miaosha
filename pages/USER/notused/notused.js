import { couponList, getCoupon } from '../../../services/API';
import { js_date_time, dalay } from '../../../utils/utils';

const app = getApp();
Page({
  data: {
    coupons: [],
    navs: [
      {
        type: 1,
        name: '默认'
      },
      {
        type: 2,
        name: '即将过期'
      }
    ],
    p: 1,
    activeType: 1
  },
  onLoad() {
    this.couponList({type: this.data.activeType, p: this.data.p});
  },
  couponList(params) {
    couponList(params).then(({ status, result, msg }) => {
      if (status == 1) {
        const coupons = (result || []).map(item => {
          let startDate = js_date_time(item.use_start_time).split(" ");
          let endDate = js_date_time(item.use_end_time).split(" ");
          return {
            name: item.name,
            money: parseInt(item.money),
            condition: item.condition,
            startTime: startDate[0],
            endTime: endDate[0],
            id: item.id,
            isget: item.isget
          }
        });
        const arr = this.data.coupons.concat(coupons);
        this.setData({
          coupons: arr,
          p: ++this.data.p,
          isAgain: true
        })
        this.finish(coupons);
      } else {
        app.wxAPI.alert(msg)
      }
    })
  },
  onReachBottom() {
    if (!dalay(1000)) return;
    if (!this.data.isAgain) return;
    this.setData({ isAgain: false });
    this.couponList({ type: this.data.activeType, p: this.data.p });
  },
  reset() {
    this.setData({
      coupons: [],
      p: 1,
      id: 1,
      isAgain: true,
      isNomore: false
    })
  },
  switchTab(e) {
    const type = e.currentTarget.dataset.type;
    this.reset();
    dalay(500); // 防止触发 到底
    this.setData({ activeType: type });
    this.couponList({ type: this.data.activeType, p: this.data.p });
  },
  receiveCoupon(e) {
    const index = e.currentTarget.dataset.index;
    const id = e.currentTarget.dataset.id;
    let arr = this.data.coupons;
    getCoupon({coupon_id: id}).then(({status, result, msg}) => {
      if(status == 1) {
        arr[index].isget = 1;
        this.setData({
          coupons: arr
        })
      } else {
        app.wxAPI.alert(msg)
      }
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