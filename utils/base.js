import { Config } from 'config.js';

class Base { 
  constructor() {
    this.baseRequestUrl = Config.restUrl;
  }

  // 对小程序请求的一个封装
  request(params, noRefetch) {
    var url = this.baseRequestUrl + params.url;
    wx.request({
      url,
      data: params.data,
      method: 'get' || params.type,
      header: {
        'content-type': 'application/json',
        // 令牌存到了缓存中
        'token': wx.getStorageSync('token')
      },
      success(res) {
        params.sCallback && params.sCallback(res.data)
      },
      fail(err) {
        console.error(err)
      }
    })
  }

  // 获取元素上的绑定值(他这个写法不是很好啊，只获取的是currentTarget)
  getDataSet(event, key){
    return event.currentTarget.dataset[key];
  }
}

export { Base };


// 控制层 home
// model层 home-model