// const notifaction = require("./WxNotificationCenter.js");

/**
 * 小程序内路由导航
 */

export default class Router {
  constructor() {

  }

  // 提交订单
  static submitOrder(account) {
    this.goto(`/pages/order/order?account=${account}&from=cart`);
  }

  // 查看商品详情
  static goodDetail(id) {
    this.goto(`/pages/product/product?id=${id}`);
  }

  // 跳转主题列表
  static ThemeList(themeData) {
    this.goto(`/pages/theme/theme?id=${themeData.id}&name=${themeData.name}`)
  }

  // 查看订单详情
  static orderDetail(id) {
    this.goto(`/pages/order/order?from=order&id=${id}`);
  }

  // 支付成功页面
  static payResult(payData) {
    this.goto(`/pages/pay-result/pay-result?id=${payData.id}&flag=${payData.flag}&from=${payData.from}`);
  }




  static goto(url) {
    wx.navigateTo({
      url: url
    });
  }

  static redirectTo(url) {
    wx.redirectTo({
      url: url
    });
  }

  //返回一次 默认只返回一级页面，如果delta大于现有页面数，则返回到首页
  static back(delta = 1) {
    wx.navigateBack({
      delta: delta,
    });
  }
}