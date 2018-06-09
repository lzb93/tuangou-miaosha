
import { getGoodsaddcomment } from '../../../services/API.js'
import { format } from '../../../utils/utils'
import { uploadFile } from '../../../utils/request'

const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    host: app.host,
    http: app.http,
    order: '',
    comment: '',

    commentIngs: [],
    order_id: "",
    goods_id: {},
    score: 5,//星级
    goodsRank: 5,
    deliverRank: 5,
    serviceRank: 5,
    anonymous: 0, //是否密名1或0
    // content:'',//内容
    productStar: [
      "../../../images/xin2.png",
      "../../../images/xin2.png",
      "../../../images/xin2.png",
      "../../../images/xin2.png",
      "../../../images/xin2.png",
    ],
    wuliuStar: [
      "../../../images/xin2.png",
      "../../../images/xin2.png",
      "../../../images/xin2.png",
      "../../../images/xin2.png",
      "../../../images/xin2.png",
    ],
    serviceStar: [
      "../../../images/xin2.png",
      "../../../images/xin2.png",
      "../../../images/xin2.png",
      "../../../images/xin2.png",
      "../../../images/xin2.png",
    ],
    xingji: [
      "../../../images/xin2.png",
      "../../../images/xin2.png",
      "../../../images/xin2.png",
      "../../../images/xin2.png",
      "../../../images/xin2.png",
    ]

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    this.setData({ order: app.cancelOrder.order_goods[0] })
  },
  chooseImage() {
    app.wxAPI.chooseImage({ num: 9 })
      .then(({ tempFiles }) => {
        const arr = [];
        const length = tempFiles.length;
        for (let i = 0; i < length; i++) {
          uploadFile(app.host + 'c=User&a=uploadImg', tempFiles[i]).then(res => {
            if (JSON.parse(res).status == 1) {
              arr.push(JSON.parse(res).result);
              if (arr.length == length) {
                this.setData({
                  commentIngs: arr
                })
              }
            }
          })
        }
      })
  },
  pinglunFabu() {
    var ids = {}
    const order = this.data.order;
    if (this.data.comment.length < 5) {
      app.wxAPI.alert("评论字数不能少于5个字");
      return
    }
    getGoodsaddcomment({
      order_id: order.order_id,   //订单id
      goods_id: order.goods_id,   //商品id
      goods_rank: this.data.goodsRank,//星级
      deliver_rank: this.data.deliverRank,
      service_rank: this.data.serviceRank,
      goods_score: this.data.score,
      content: this.data.comment,//内容
      is_anonymous: this.data.anonymous, //是否密名1或0
      img: this.data.commentIngs,//上传晒单图片 后面 [0]表示第一张 [1]第二张[2]第三章 一次类推,可以多张图片
    })
      .then(({ status, result, msg }) => {
        if (status === 1) {
          app.wxAPI.toast(msg);
          wx.switchTab({
            url: '/pages/HOME/home/home'
          })
        } else {
          app.wxAPI.alert(msg)
        }
      })

  },
  setpingjia(e) {
    this.setData({
      comment: e.detail.value
    })
  },
  onInput(e) {
    setTimeout(() => {
      this.setData({
        comment: e.detail.value
      })
    }, 50)
  },
  xingji(e) {
    let xingji = this.data.xingji
    for (let i = 0; i < 5; i++) {
      xingji[i] = "../../../images/xin1.png"
    }
    for (let i = 0; i < e.currentTarget.dataset.index + 1; i++) {
      xingji[i] = "../../../images/xin2.png"
    }
    this.setData({
      xingji: xingji,
      score: e.currentTarget.dataset.index + 1
    })
  },
  productStar(e) {
    let xingji = this.data.productStar
    for (let i = 0; i < 5; i++) {
      xingji[i] = "../../../images/xin1.png"
    }
    for (let i = 0; i < e.currentTarget.dataset.index + 1; i++) {
      xingji[i] = "../../../images/xin2.png"
    }
    this.setData({
      productStar: xingji,
      productRank: e.currentTarget.dataset.index + 1
    })
  },
  wuliuStar(e) {
    let xingji = this.data.wuliuStar
    for (let i = 0; i < 5; i++) {
      xingji[i] = "../../../images/xin1.png"
    }
    for (let i = 0; i < e.currentTarget.dataset.index + 1; i++) {
      xingji[i] = "../../../images/xin2.png"
    }
    this.setData({
      wuliuStar: xingji,
      wuliuRank: e.currentTarget.dataset.index + 1
    })
  },
  serviceStar(e) {
    let xingji = this.data.serviceStar
    for (let i = 0; i < 5; i++) {
      xingji[i] = "../../../images/xin1.png"
    }
    for (let i = 0; i < e.currentTarget.dataset.index + 1; i++) {
      xingji[i] = "../../../images/xin2.png"
    }
    this.setData({
      serviceStar: xingji,
      serviceRank: e.currentTarget.dataset.index + 1
    })
  }



})