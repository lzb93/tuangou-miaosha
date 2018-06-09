import { teamDetail, collectGoods, addOrder, teamOrder, teamInfo } from '../../../services/API';
import { js_date_time, remainTime } from '../../../utils/utils';

const WxParse = require('../../../utils/wxParse/wxParse.js')
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    http: app.http,
    host: app.host,
    gallerys: [],
    goodsInfo: {},
    goodsContent: '',
    comments: [],
    teamInfo: {},
    selectedSpec: {},
    isShowPop: false,
    foundId: '',
    teamFounds: [],
    foundId: ''
  },
  onLoad(e) {
    const foundId = e.found_id;
    teamDetail({ goods_id: e.id, team_id: e.team_id }).then(({ status, result, msg }) => {
      if (status == 1) {
        const comments = [];
        (result.comment || []).map((item) => {
          comments.push({
            add_time: js_date_time(item.add_time),
            content: item.content,
            username: item.username,
            head_pic: item.head_pic
          })
        });
        const specs = [];
        (result.goods_spec_list || []).forEach((spec) => {
          const items = [];
          (spec.spec_list || []).forEach((item, index) => {
            items.push({
              item: item.item,
              item_id: item.item_id,
              src: item.src,
              selected: index == 0 ? true : false
            })
          })
          specs.push({
            spec_list: items,
            spec_name: spec.spec_name
          })
        })
        this.setData({
          gallerys: result.goods_images_list,
          goodsInfo: result.goods,
          comments: comments,
          goodsContent: result.goods.goods_content,
          teamInfo: result.team,
          specs: specs,
          foundId: foundId || ''
        })
        if (foundId) {
          this.openPop();
        }
        app.statistics = this.data.goodsInfo.comment_statistics;
        WxParse.wxParse('article', 'html', result.goods.goods_content, this, 5);

      } else {
        app.wxAPI.alert(msg);
      }
    })
    teamInfo({ goods_id: e.id }).then(({ status, result, msg }) => {
      if (status == 1) {
        this.setData({
          teamFounds: result.teamFounds
        })
      } else {
        app.wxAPI.alert(msg);
      }
    })
  },
  collectFn(e) {
    let goodsInfo = this.data.goodsInfo;
    const goodsId = goodsInfo.goods_id;
    const isCollect = this.data.goodsInfo.is_collect ? 0 : 1;
    collectGoods({ goods_id: goodsId, type: isCollect }).then(({ status, result, msg }) => {
      if (status == 1) {
        goodsInfo.is_collect = isCollect;
        this.setData({ goodsInfo: goodsInfo });
        if (isCollect) {
          app.wxAPI.toast("已收藏");
        }
      }
    })
  },
  openPop(e) {
    let foundId = '';
    if (e) {
      foundId = e.currentTarget.dataset.foundId
    } else if (this.data.foundId) {
      foundId = this.data.foundId;
    }

    this.setData({
      isShowPop: true,
      foundId: foundId || ''
    })
    if (this.data.specs.length == 0) {
      const teamInfo = this.data.teamInfo;
      const goods = this.data.goodsInfo
      this.setData({
        selectedSpec: {
          goods_id: goods.goods_id,
          team_id: teamInfo.team_id,
          store_count: goods.store_count,
          price: teamInfo.team_price,
          num: 1
        }
      })
    } else {
      this.formatSelectedProduct();
    }
  },
  selectSpec(e) {
    const specs = e.currentTarget.dataset.specs;
    const id = e.currentTarget.dataset.id;
    const name = e.currentTarget.dataset.name;
    (specs || []).forEach((spec) => {
      if (spec.spec_name == name) {
        (spec.spec_list || []).forEach((item) => {
          item.selected = item.item_id == id ? true : false;
        })
      }
    })
    this.setData({
      specs: specs
    })
    this.formatSelectedProduct();
  },
  formatSelectedProduct() {
    let selectedName = '';
    (this.data.specs || []).forEach((spec) => {
      (spec.spec_list || []).forEach((item) => {
        if (item.selected) {
          selectedName += "_" + item.item_id;
        }
      })
    })

    let selectedSpec = (this.data.goodsPrices || []).find((item) => {
      return ("_" + item.key) == selectedName;
    })
    if (selectedSpec) {
      selectedSpec.num = 1;
      this.setData({
        selectedSpec: selectedSpec
      })
    } else {
      this.setData({
        selectedSpec: {
          price: this.data.defaultPrice,
          store_count: 0,
          num: 1
        }
      })
    }
  },
  colsePop() {
    this.setData({
      isShowPop: false,
      foundId: ''
    })
  },
  downNum() {
    let selectedSpec = this.data.selectedSpec
    if (selectedSpec.num > 1) {
      selectedSpec.num = --selectedSpec.num
      this.setData({ selectedSpec })
    }
  },
  upNum() {
    if (this.data.foundId) {
      return;
    }
    let selectedSpec = this.data.selectedSpec;
    const mastNum = this.data.teamInfo.buy_limit || this.data.goodsInfo.store_count;
    if (selectedSpec.num < mastNum) {
      selectedSpec.num = ++selectedSpec.num
      this.setData({ selectedSpec })
    }
  },
  onblur(e) {
    let num = e.detail.value;
    let selectedSpec = this.data.selectedSpec;
    const mastNum = this.data.teamInfo.buy_limit || this.data.goodsInfo.store_count;
    if (num > 0 && num <= mastNum) {
      selectedSpec.num = num;
      this.setData({ selectedSpec })
    } else if (num > mastNum) {
      selectedSpec.num = mastNum;
      this.setData({ selectedSpec })
    } else if (num <= 0) {
      selectedSpec.num = 1;
      this.setData({ selectedSpec })
    }
  },
  sure() {
    let token = app.token;
    if (!token) {
      // 没登录处理....
      app.wxAPI.alert('未登陆!')
        .then(() => {
          wx.reLaunch({
            url: `/pages/USER/user/user?from=pages/TEAM/detail/detail&id=${this.data.goodsInfo.goods_id}&team_id=${this.data.teamInfo.team_id}`
          })
        })
      return
    }
    const selectedSpec = this.data.selectedSpec;
    let params = {
      team_id: selectedSpec.team_id,
      goods_num: selectedSpec.num,
      found_id: this.data.foundId || ''
    };
    addOrder(params)
      .then(({ status, result, msg }) => {
        if (status == 1) {
          wx.navigateTo({
            url: '/pages/CART/payOrder/payOrder?order_sn=' + result.order_sn
          })
          this.colsePop();
        } else {
          app.wxAPI.alert(msg);
        }
      })
  },
  onShareAppMessage(res) {
    return {
      title: this.data.goodsInfo.goods_name,
      path: '/pages/KILL/detail/detail?id=' + this.data.goodsInfo.goods_id + '&team_id=' + this.data.teamInfo.team_id + '&userId=' + app.userInfo.user_id
    }
  }
})