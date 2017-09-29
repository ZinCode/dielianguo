

// HTTP工具类
export default class WxRequest {
  constructor(defaults) {
    this.baseURL = ''
    Object.assign(this, defaults)
  }

  request(method, url, data = {}) {
    return new Promise((resolve, reject) => {
      console.log(this)
      const header = this.createAuthHeader();
      wx.request({
        // 拼接url
        url: `${this.baseURL}${url}`,
        // 目前来看是只用到了get和post两种方法，但是为了扩展性，我们需要规范一点
        method: method,
        data: data,
        header: header,
        success: (res) => {
          // 微信状态校验
          const wxCode = res.statusCode;
          if (wxCode != 200) {
            console.error('服务端请求错误', res)
            this.handleHttpException(res);
            reject(res);
          } else {
            // 服务端状态校验
            const wxData = res.data;
            if (wxData.error_code) {
              console.error('服务端业务错误', res);
              reject(res);
            } else {
              // 正确返回数据
              resolve(wxData);
            }
          }
        },
        fail(res) {
          console.error('网络请求发起失败', res);
          reject(res);
        }
      })
    })
  }

// 下面整体写的都不够好

  /**
   * 错误处理器
   */
  handleHttpException(res) {
    const status = res.statusCode;
    switch (status) {
      case 403:
        this.handleHttp403Exception(res);
        break;
      case 404:
        this.handleHTTP404Exception(res);
        break;
      case 500:
        this.handleHttp500Exception(res);
        break;
      default:
        console.info('其他错误', res);
    }
  }

  /**
   * 403无权限错误
   */
  handleHttp403Exception(res) {
    //需要区分两403之间的区别
    console.error(`403-权限错误：${res.data.msg}`);
  }

  /**
   * 500内部错误
   */
  handleHttp500Exception(res) {
    console.error(`500-服务器内部错误：${res.data.msg}`);
  }

  /**
   * 404 错误
   */
  handleHttp404Exception(res) {
    console.error(`404-请求资源不存在：${res.data.msg}`);
  }

  /**
   * 构造权限头部
   */
  createAuthHeader() {
    // 获取token
    const Token = wx.getStorageSync('token');
    var header = {
      'content-type': 'application/json'
    }
    if (Token) {
      header.Token = Token;
    }
    return header;
  }
}
