import * as wxAPI from './wxAPI'
import { thirdLogin } from './API'

// 获取用户信息（一系列流程）

export function auth(cb, page, id, itemId, teamId) {
 
  let userInfo = '';
  wxAPI.getSetting()
  .then((res) => {
    if(~res.indexOf('scope.userInfo')) {
      wxAPI.getUserInfo()
      .then((res) => {
        userInfo = res.userInfo;
        wxAPI.showLoading('登陆中...', true)
        return wxAPI.login()
      })
      .then((res) => {
        return thirdLogin({
          code: res.code,
          from: 'miniapp', 
          nickname: userInfo.nickName, 
          head_pic: userInfo.avatarUrl
        })
      })
      .then(({ status, result, msg }) => {
        wxAPI.hideLoading();
        getApp().userInfo = result;
        getApp().token = result.token;
        cb && cb(result);
        if(teamId) {
          wx.navigateTo({
            url: '/' + page + '?id=' + id + '&team_id=' + teamId
          })
          return;
        }
        if(itemId) {
          wx.navigateTo({
            url: '/' + page + '?id=' + id + '&item_id=' + itemId
          })
        } else if(id && !itemId) {
          wx.navigateTo({
            url: '/' + page + '?id=' + id
          })
        } else if(page) {
          wx.reLaunch({
            url: '/' + page
          })
        }
      })
      .catch((e) => {
        wxAPI.hideLoading();
      })
      return;
    } else {
      wxAPI.hideLoading();
      return;
    }
  })
}
