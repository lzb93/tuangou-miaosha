// 获取code
export function login() {
  return new Promise((resolve, reject) => {
    wx.login({
      success(res) {
        if (res.code) {
          resolve(res)
        } else {
          reject(e)
        }
      },
      fail(e) {
        reject(e)
      }
    })
  })
}
// 检查登录状态
export function checkSession() {
  return new Promise((resolve, reject) => {
    wx.checkSession({
      success() {
        resolve(true)
      },
      fail(e) {
        resolve(false)
      }
    })
  })
}
// 获取已通过的授权对象
export function getSetting() {
  return new Promise((resolve, reject) => {
    wx.getSetting({
      success(res) {
        resolve(Object.keys(res.authSetting || {}))
      },
      fail(e) {
        reject(e)
      }
    })
  })
}
// 跳转到设置界面
export function openSetting(scope) {
  return new Promise((resolve, reject) => {
    wx.openSetting({
      success(res) {
        resolve(res)
      },
      fail(e) {
        reject(e)
      }
    })
  })
}
// 发起授权对象
export function authorize(scope) {
  return new Promise((resolve, reject) => {
    wx.authorize({
      scope: scope,
      success(res) {
        resolve(res)
      },
      fail(e) {
        reject(e)
      }
    })
  })
}

// 获取用户信息
export function getUserInfo() {
  return new Promise((resolve, reject) => {
    wx.getUserInfo({
      lang: 'zh_CN',
      success(res) {
        resolve(res)
      },
      fail(e) {
        reject(e)
      }
    })
  })
}
export function requestPayment(obj) {
  return new Promise((resolve, reject) => {
    wx.requestPayment({
      ...obj,
      success(res) {
        resolve({
          status: 1,
          msg: res
        })
      },
      fail(e) {
        resolve({
          status: -1,
          msg: e
        })
      }
    })
  })
}

// alert
export function alert(msg = '') {
  return new Promise((resolve, reject) => {
    wx.showModal({
      title: '',
      content: msg,
      showCancel: false,
      success(res) {
        if (res.confirm) {
          resolve()
        }
      }
    })
  })
}
// confirm
export function confirm(msg = '') {
  return new Promise((resolve, reject) => {
    wx.showModal({
      title: '',
      content: msg,
      success(res) {
        if (res.confirm) {
          resolve()
        } else if (res.cancel) {
          reject()
        }
      }
    })
  })
}
// toast
export function toast(msg = '', type) {
  return new Promise((resolve, reject) => {
    if (type == 'error') {
      wx.showToast({
        title: msg,
        image: '/images/sibai.png'
      })
    } else {
      wx.showToast({
        title: msg,
        icon: 'success'
      })
    }
  })
}
// loading
export function showLoading(msg = '加载中', showMask = true) {
  return wx.showLoading({
    title: msg,
    mask: showMask
    // duration: 2000
  })
}
export function hideLoading() {
  return wx.hideLoading()
}
// 从本地相册选择图片或使用相机拍照
export function chooseImage(options) {
  return new Promise((resolve, reject) => {
    wx.chooseImage({
      count: options.num || '',
      success(res) {
        resolve(res)
      },
      fail(e) {
        reject(e)
      }
    })
  })
}
// 从本地相册选择图片或使用相机拍照
// export function uploadFile(url, { filePath, name }) {
//   return new Promise((resolve, reject) => {
//     wx.uploadFile({
//       url,
//       filePath,
//       name,
//       success (res) {
//         resolve(res)
//       },
//       fail (e) {
//         reject(e)
//       }
//     })
//   })
// }