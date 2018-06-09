import { json2Form, modifyUrl, randomString } from './utils'

function getToken() {
  return getApp().token || ''
}
function getUserid() {
  if (getApp().userInfo) {
    return getApp().userInfo.user_id || ''
  } else {
    return ''
  }
}

export default function request(url, data = {}, methods = 'GET') {
  url = modifyUrl(url, {
    is_json: 1,
    token: getToken(),
    user_id: getUserid()
  })
  return new Promise((resolve, reject) => {
    wx.request({
      url: url,
      data: data,
      method: methods,
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: resolve,
      fail: reject
    })
  })
    .then(({ data, statusCode, errMsg }) => {
      if (statusCode != 200) {
        return Promise.reject(errMsg)
      } else {
        if (data.status == -100 || data.status == -101) {
          // 没登录处理....
          getApp().getUserInfo(() => {
            wx.switchTab({
              url: '/pages/HOME/home/home'
            })
          })
          return Promise.reject(errMsg)
        }
        return data
      }
    })
    .catch((res) => {
      getApp().wxAPI.alert(res.msg);
    })
}

// 上传图片（文件）
export function uploadFile(url, file) {
  // 附加鉴权参数
  // url = modifyUrl(url, {
  //   is_json: 1,
  //   unique_id: getUniqueId(),
  //   token: getToken()
  // })
  return new Promise((resolve, reject) => {
    wx.uploadFile({
      url,
      filePath: file.path,
      name: 'file',
      success(res) {
        resolve(res)
      },
      fail(e) {
        reject(e)
      }
    })
  })
    .then(({ data, statusCode, errMsg }) => {
      if (statusCode != 200) {
        return Promise.reject(errMsg)
      } else {
        return data
      }
    })
}
export function get(url, data = {}) {
  return request(url, data, 'GET')
}
export function post(url, data = {}) {
  return request(url, data, 'POST')
}