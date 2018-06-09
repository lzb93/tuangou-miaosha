import { cartList, delCart, getCouponList } from '../../../services/API'
import config from '../../../utils/config'
const app = getApp()
Page({
  data: {
    txtStyle: '',
    startX: 0,
    moveX: 0,
    endX: 0,
    disX: 0,
    host: config.host,
    items: [],
    total_price: {},
    num: 1,
    checkedLen: 0,
    isChecked: true,
    isNomore: false,
    isShowCoupon: false,
    isEmpty: false
  },
  onLoad() {},
  onShow() {
    let token = app.token;
    if (!token) {
      app.wxAPI.alert('未登录!')
      .then(() => {
        wx.reLaunch({
          url: '/pages/USER/user/user?from=pages/CART/cart/cart'
        })
      })
      return
    }
    cartList().then(this.render)
  },
  render({ status, result, msg }) {
    if (status === 1) {
      this.setData({
        items: result.cartList,
        total_price: result.total_price,
        checkedLen: result.cartList.filter(item => item.selected).length
      })
      const is = this.isCheckedAll()
      this.setData({ isChecked: is ? false : true })
      const len = this.data.items.length == 0
      this.setData({ isNomore: len ? true : false })
    } else {
      app.wxAPI.alert(msg)
    }
  },
  checked(e) {
    const index = e.currentTarget.dataset.index
    const obj = this.data.items[index]
    let params = [{
      selected: obj.selected ? 0 : 1,
      cartID: obj.id,
      goodsNum: obj.goods_num,
      user_id: getApp().userInfo.user_id
    }]
    cartList({ cart_form_data: JSON.stringify(params) })
      .then(this.render)
  },
  checkedAll() {
    const is = this.isCheckedAll()
    const arr = this.data.items
    let params = []
    arr.forEach(item => {
      params.push({
        selected: is ? 1 : 0,
        cartID: item.id,
        goodsNum: item.goods_num,
        user_id: getApp().userInfo.user_id
      })
    })
    cartList({ cart_form_data: JSON.stringify(params) })
      .then(this.render)
  },
  // 判断是全选 还是 全反选
  isCheckedAll() {
    const arr = this.data.items
    return !arr.every(({ selected }) => selected == 1)
  },
  del(e) {
    app.wxAPI.confirm('确定删除？')
      .then(() => {
        const index = e.currentTarget.dataset.index
        const obj = this.data.items[index]
        return delCart({ ids: obj.id })
      })
      .then(({ status, result, msg }) => {
        if (status === 1) {
          cartList().then(this.render)
          app.wxAPI.toast('删除成功')
        } else {
          app.wxAPI.alert(msg)
        }
      })
  },
  onblur(e) {
    let num = e.detail.value
    const index = e.currentTarget.dataset.index
    const obj = this.data.items[index]
    let params = [{
      selected: obj.selected,
      cartID: obj.id,
      goodsNum: num <= 0 ? 1 : num
    }]
    cartList({ cart_form_data: JSON.stringify(params) })
      .then(this.render)
  },
  add(e) {
    const index = e.currentTarget.dataset.index
    const obj = this.data.items[index]
    if (obj.goods_num < 99) {
      let params = [{
        selected: obj.selected,
        cartID: obj.id,
        goodsNum: ++obj.goods_num
      }]
      cartList({ cart_form_data: JSON.stringify(params) })
        .then(this.render)
    }
  },
  subtract(e) {
    const index = e.currentTarget.dataset.index
    const obj = this.data.items[index]
    if (obj.goods_num > 1) {
      let params = [{
        selected: obj.selected,
        cartID: obj.id,
        goodsNum: --obj.goods_num
      }]
      cartList({ cart_form_data: JSON.stringify(params) })
        .then(this.render)
    }
  },
  settlement() {
    if (this.data.checkedLen <= 0) {
      return app.wxAPI.alert('尚选中任何商品')
    }
    wx.navigateTo({ url: '/pages/CART/payOrder/payOrder' })
  },
  end(e) {
    let endX = e.changedTouches[0].clientX
    let items = this.data.items
    let index = e.currentTarget.dataset.index
    if (this.data.disX > 40) {
      items[index]['txtStyle'] = 'transform: translateX(-13%); transition: transform 0.1s ease-in;'
    } else if (this.data.disX < -30) {
      items[index]['txtStyle'] = 'transform: translateX(0); transition: transform 0.1s ease-in;'
    }
    this.setData({ items: items })
  },
  jumpDetail(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/KILL/detail/detail?id=${id}`
    })
  }
})
