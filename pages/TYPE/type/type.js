import { getCategory, getGoodsList } from '../../../services/API';

const app = getApp();
Page({
  data: {
    http: app.http,
    host: app.host,
    categorys: '',
    items: [],
    page: 0,
    isAgain: true,
    isNomore: false,
    active: 0,
    activeCategoryId: ''
  },
  onLoad() { 
    getCategory().then(({status, result, msg}) => {
      if(status == 1) {
        const items = this.data.items;
        this.setData({
          categorys: result.category,
          items: items.concat(result.list),
          page: ++this.data.page,
          isAgain: true
        })
        this.finish(result.list);
      }
    })
  },
  //公用加载内容
  getGoodsList(params) {
    getGoodsList(params).then(({status, result, msg}) => {
      if(status == 1) {
        const items = this.data.items;
        this.setData({
          items: items.concat(result),
          page: ++this.data.page,
          isAgain: true
        })
        this.finish(result);
      }
    })
  },
  //tab切换
  switchTab(e) {
    const index = e.currentTarget.dataset.index;
    const id = e.currentTarget.dataset.id;
    this.reset();
    this.setData({ active: index, activeCategoryId: id });
    this.getGoodsList({ page: this.data.page, category_id: id })
  },
  //滚动到底部
  onReachBottom() {
    if (!this.data.isAgain) return;
    this.setData({ isAgain: false });
    const categoryId = this.data.activeCategoryId;
    this.getGoodsList({ page: this.data.page, category_id: categoryId });
  },
  //重置函数
  reset() {
    this.setData({
      items: [],
      page: 0,
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
  onblur(e) {
    this.setData({
      keyword: e.detail.value
    })
  },
  oninput(e) {
    let keyword = e.detail.value
    if (keyword != '') {
      this.setData({
        isEmpt: true,
        keyword
      })
    } else {
      this.setData({
        isEmpt: false
      })
    }
    return keyword.trim()
  },
  empt() {
    setTimeout(() => {
      this.setData({
        keyword: '',
        isEmpt: false
      })
    }, 50)
  },
  search() {
    const keyword = this.data.keyword;
    if (keyword) {
      wx.navigateTo({
        url: `/pages/HOME/type/type?keyword=${keyword}`
      })
    }
  }
})