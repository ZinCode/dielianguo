const app = getApp()

export default class Token{
  // 验证token
  verify(){
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
    app.HttpService.postVerifyToken({token: token})
      .then(res => {
        var valid = res.data.isValid
        if (!valid) {
          this.getTokenFromServer()
        }
      })
  }

  // 重新获取token
  getTokenFromServer() {
    // 返回一个promise对象吧
    return app.WxApi.login()
      .then(res => {
        app.HttpService.postUserToken({code: res.code})
          .then(data => {
            app.HttpService.setStorageSync('token', data.data.token)
          })
      })
  }
}