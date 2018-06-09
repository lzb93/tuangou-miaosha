import { orderEdit, getAddressList, saveOrder, teamOrder, getOrderInfo } from '../../../services/API';

const app = getApp();
Page({
  data: {
    http: app.http,
    host: app.host,
    address: {},
    userInfo: {},
    totalPrice: {},
    items: [],
    coupons: [],
    address_id: '',
    pageType: '',
    selectCoupon: {},
    isShowPop: false
  },
  onLoad(option) {
    if (option && option.order_sn) {
      this.setData({
        pageType: option.order_sn
      })
    }
  },
  onShow() {
    app.orderAddress && this.setData({
      address: app.orderAddress
    });
    if (this.data.pageType) {
      this.teamOrder({ order_sn: this.data.pageType });
    } else {
      this.orderEdit(app.orderAddress.address_id || '');
    }
  },
  teamOrder(params) {
    teamOrder(params).then(({ status, result, msg }) => {
      if (status == 1) {
        let items = [];
        result.order_goods.goods_price = result.order_goods.member_goods_price;
        items.push(result.order_goods);
        this.setData({
          address: result.addressList,
          items: items,
          totalPrice: {
            goods_num: result.order_goods.goods_num,
            total_fee: result.order_goods.member_goods_price
          },
          userInfo: result.userInfo,
          order: result.order
        })
        if (result.addressList) {
          this.setData({ address_id: result.addressList.address_id })
          this.teamChange()
        } else {
          app.wxAPI.confirm("去新建一个收货地址？")
            .then(() => {
              wx.navigateTo({
                url: '/pages/USER/addAddress/addAddress?from=payOrder'
              })
            })
            .catch(() => {
              wx.navigateBack()
            })
        }
      } else {
        app.wxAPI.alert(msg);
      }
    })
  },
  orderEdit(addressId) {
    orderEdit({ address_id: addressId }).then(({ status, result, msg }) => {
      if (status == 1) {
        this.setData({
          address: result.userAddress,
          items: result.cartList,
          totalPrice: result.cartPriceInfo,
          userInfo: result.userInfo,
          coupons: result.userCartCouponList
        })
        if (result.userAddress) {
          this.setData({ address_id: result.userAddress.address_id })
          this.change()
        } else {
          app.wxAPI.confirm("去新建一个收货地址？")
            .then(() => {
              wx.navigateTo({
                url: '/pages/USER/addAddress/addAddress?from=payOrder'
              })
            })
            .catch(() => {
              wx.navigateBack()
            })
        }
      } else {
        app.wxAPI.alert(msg);
      }
    })
  },
  changeAddress() {
    wx.navigateTo({
      url: '/pages/EXPRESS/address/address?type=payOrder'
    })
  },
  // 价格变动（使用积分，选择物流）
  change() {
    let params = {
      user_id: this.data.userInfo.user_id,
      act: 'order_price',
      address_id: this.data.address.address_id || '',
      coupon_id: this.data.selectCoupon.id || ''
    }
    saveOrder(params)
      .then(({ status, result, msg }) => {
        if (status === 1) {
          let totalPrice = this.data.totalPrice;
          totalPrice.total_fee = result.order_amount; //应付总额
          this.setData({
            totalPrice,
            shippingPrice: result.shipping_price
          })
        } else {
          app.wxAPI.alert(msg)
        }
      })
  },
  //拼团价格变动
  teamChange() {
    let params = {
      order_id: this.data.order.order_id,
      goods_num: this.data.totalPrice.goods_num,
      address_id: this.data.address.address_id || '',
      act: ''
    };
    getOrderInfo(params).then(({ status, result, msg }) => {
      if (status == 1) {
        let totalPrice = this.data.totalPrice;
        totalPrice.total_fee = result.order.order_amount
        this.setData({
          totalPrice,
          shippingPrice: result.order.shipping_price
        })
      } else {
        app.wxAPI.alert(msg)
      }
    })
  },
  useCoupon(e) {
    const couponId = e.currentTarget.dataset.id;
    const selectCoupon = (this.data.coupons || []).find(item => {
      return item.id == couponId;
    })
    if (selectCoupon) {
      this.setData({
        selectCoupon
      })
    }
    this.setData({
      isShowPop: false
    })
    this.change()
  },
  notUseCoupon() {
    this.setData({
      isShowPop: false,
      selectCoupon: {}
    })
    this.change()
  },
  // 常规提交
  save() {
    let params = {
      user_id: this.data.userInfo.user_id,
      act: 'submit_order', // order_price 为价格变动submit_order为提交订单
      address_id: this.data.address.address_id || '',
      coupon_id: this.data.selectCoupon.id || ''
    }
    saveOrder(params)
      .then(({ status, result, msg }) => {
        if (status === 1) {
          wx.redirectTo({
            url: `/pages/CART/payment/payment?orderSn=${result}`
          })
        } else {
          app.wxAPI.alert(msg)
        }
      })
  },
  // 拼团立即支付
  payment() {
    let params = {
      order_id: this.data.order.order_id,
      goods_num: this.data.totalPrice.goods_num,
      address_id: this.data.address.address_id || '',
      act: 'submit_order'
    }
    getOrderInfo(params).then(({status, result, msg}) => {
      if(status == 1) {
        wx.redirectTo({
          url: `/pages/CART/payment/payment?orderSn=${this.data.pageType}&money=${result.order_amount}&type=team`
        })
      } else {
        app.wxAPI.alert(msg)
      }
    })
  },
  selectCoupon() {
    const coupons = this.data.coupons;
    if(coupons.length == 0) {
      return;
    }
    this.setData({
      isShowPop: true
    })
  }
})