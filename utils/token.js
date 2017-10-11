const app = getApp()

export default class Token {
  // 验证token
  verify() {
    var token = app.WxApi.getStorageSync('token')
    // 如果token不存在
    if (!token) {
      // 去服务器获取token
      this.getTokenFromServer()
    } else {
      // 从服务器验证token的准确性
      this._verfyFromServer(token)
    }
  }

  // 鉴别token真伪
  _verfyFromServer(token) {
    app.HttpService.postVerifyToken({ token: token })
      .then(res => {
        console.log('鉴别token真伪', res)
        var valid = res.data.isValid
        if (!valid) {
          this.getTokenFromServer()
        }
      })
  }

  // 重新获取token
  getTokenFromServer() {
    // 返回一个promise对象吧
    return new Promise((resolve, reject) => {
      wx.login({
        success(res) {
          wx.request({
            url: 'https://urguo.com/api/v1/token/user',
            method: 'POST',
            data: {
              code: res.code
            },
            success(data) {
              wx.setStorageSync('token', data.data.token);
              resolve(data)
            },
            fail(err) {
              reject(err)
            }
          })
        }
      })
    })

    /**
     * 为了防止循环引用，这里的逻辑还需要修改一下
     */
    
    //  return app.WxApi.login()
    //     .then(res => {
    //       console.log('keyima')
    //       return app.HttpService.postUserToken({code: res.code})
    //         .then(data => {
    //           app.HttpService.setStorageSync('token', data.data.token)
    //         })
    //     })
  }
}