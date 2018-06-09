import { getAddressList, setDefaultAddress, delAddress } from '../../../services/API';

const app = getApp();
Page({
  data: {
    addList: [],
    defaultAdd: {}
  },
  onLoad(e) {
    const expressType = e.type;
    expressType && this.setData({ expressType });
  },
  onShow() {
    this.init();
  },
  init() {
    getAddressList().then(({ status, result, msg }) => {
      this.setData({
        addList: result
      })
    })
  },
  selectItem(e) {
    const id = e.currentTarget.dataset.id;
    const arr = this.data.addList;
    let selectAdd = (arr || []).find((item) => {
      return item.address_id == id;
    });
    const expressType = this.data.expressType;
    if (expressType && expressType == 'send') {
      app.sendAddress = selectAdd;
    } else if (expressType && expressType == 'collect') {
      app.collectAddress = selectAdd;
    } else if (expressType && expressType == 'payOrder') {
      app.orderAddress = selectAdd;
    } else {
      return;
    }
    wx.navigateBack({
      delta: 1
    })
  },
  setDefaultAdd(e) {
    const index = e.currentTarget.dataset.index;
    const arr = this.data.addList;
    (arr || []).forEach((item, key) => {
      if(key == index) {
        item.is_default = 1;
      } else {
        item.is_default = 0;
      }
    })
    this.setData({
      addList: arr
    })
    setDefaultAddress({ address_id: arr[index].address_id})
    .then(({ status, result, msg }) => {
      if(status ==1) {
        
      } else {
        app.wxAPI.alert(msg)
      }
    })
  },
  edit(e) {
    let index = e.currentTarget.dataset.index;
    app.curEditAddress = this.data.addList[index];
    wx.navigateTo({
      url: `/pages/USER/addAddress/addAddress?target=${app.curEditAddress.user_id}`
    })
  },
  del(e) {
    app.wxAPI.confirm("确定删除？")
      .then(() => {
        let id = e.currentTarget.dataset.id
        return delAddress({ id: id })
      })
      .then(({ status, msg }) => {
        app.wxAPI.toast(msg)
        if (status === 1) {
          this.init()
        }
      })
      .catch(e => {
        
      })
  }
})