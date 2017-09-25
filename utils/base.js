import { Config } from '../utils/config.js';

class Base {
  constructor() {
    this.baseRequestUrl = Config.resuUrl;
  }

  // 对小程序请求的一个封装
  request(params, noRefetch) {
    var url = this.baseRequestUrl + params.url;
    wx.request({
      url: '',
      data: params.data,
      method: 'get' || params.type,
      header: {
        'content-type': 'application/json',
        // 令牌存到了缓存中
        'token': wx.getStorageSync('token')
      },
      success(res) {
        params.sCallBack && params.sCallBack(res)
      },
      fail(err) {
        console.log(err)
      }
    })
  }
}