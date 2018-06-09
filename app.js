//app.js
import * as API from './services/API'
import * as wxAPI from './services/wxAPI'
import config from './utils/config'
import { auth } from './services/auth';

App({
  userInfo: {}, // 用户信息
  token: '', // 登录状态
  curEditAddress: {}, // 当前编辑的地址
  sendAddress: {}, //寄件人地址
  collectAddress: {}, //收件人地址
  orderAddress: {}, //订单地址
  queryExpress: '', //查询快递数据
  statistics: '', //评论信息
  wxAPI: wxAPI, // 微信api promise包装
  API: API, // api
  http: config.http,// baseUrl
  host: config.host, 
  auth: auth, // 登录流程
  typeMsg: {
    id: null,
    index: null
  },
  onLaunch: function (e) {
    auth();
  }
})