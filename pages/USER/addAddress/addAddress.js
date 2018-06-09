import { addAddress, getRegion } from '../../../services/API';
import Regions from '../../../utils/regions/Regions.js';

const app = getApp();
Page({
  data: {
    adsParams: {}, //收货地址信息
  },

  onLoad: function (e) {
    const from = e.from
    const target = e.target
    from && this.setData({ from })
    wx.setNavigationBarTitle({
      title: "地址管理"
    })
    this.init(target);
  },
  init(target) {
    if (target) {
      wx.setNavigationBarTitle({
        title: "编辑地址"
      })
      let adsParams = app.curEditAddress;
      this.setData({
        adsParams
      })
    } else {
      wx.setNavigationBarTitle({
        title: "新增地址"
      })
    }
    this.initRegions();
  },

  /** 初始化区域弹框相关 */
  initRegions: function () {
    const that = this;
    new Regions(this, 'regions', {
      endAreaLevelCall: function (parentId, regionName, adsParams) {
        that.setData({
          adsParams: Object.assign(that.data.adsParams, adsParams)
        });
      }
    });
  },

  submitAddress: function (e) {
    
    const adsParams = this.data.adsParams;
    if (!adsParams.consignee) {
      app.wxAPI.alert("姓名不能为空!");
      return;
    }
    if (!adsParams.mobile) {
      app.wxAPI.alert("电话不能为空!");
      return;
    }
    if (!adsParams.province_name) {
      app.wxAPI.alert("地址不能为空!");
      return;
    }
    if (!adsParams.address) {
      app.wxAPI.alert("详细地址不能为空!");
      return;
    }
    addAddress(adsParams)
      .then(({ status, result, msg }) => {
        if (status === 1) {
          if (this.data.from === "payOrder") {
            app.curCheckedAddress = result
            return wx.navigateBack()
          }
          wx.navigateBack()
        } else {
          if (status === -1) {
            app.wxAPI.alert(msg, "error");
            this.setData({
              adsParams: {}
            })
          }
        }
      })
  },

  setConsignee(e) {
    const consignee = e.detail.value
    this.data.adsParams.consignee = consignee
    this.setData({})
  },
  setMobile(e) {
    const mobile = e.detail.value
    this.data.adsParams.mobile = mobile
    this.setData({})
  },
  setDetail(e) {
    const detail = e.detail.value
    this.data.adsParams.address = detail
    this.setData({})
  }
});

