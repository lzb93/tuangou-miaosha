import { getQueryExpress } from '../../../services/API';

const app = getApp();
Page({
  data: {
    queryExpress: '',
    index: '',
    express: '',
    shippingName: '',
    invoiceNo: ''
  },
  onLoad(option) {
    this.setData({
      shippingName: option.name,
      invoiceNo: option.no
    })
    let params = {
      invoice_no: option.no,
      shipping_code: option.code
    }
    getQueryExpress(params).then((result) => {
      if (result.status == 200) {
        const arr = this.data.array;
        const express = (arr || []).find(item => {
          return item.type == result.com;
        })
        let queryExpress = {
          expressData: result.data,
          nu: result.nu
        }
        this.setData({ queryExpress, express });
      } else {
        app.wxAPI.alert('未有物流信息，请耐心等待')
          .then(() => {
            wx.navigateBack({
              delta: 1
            })
          })
      }
    })
  }
})