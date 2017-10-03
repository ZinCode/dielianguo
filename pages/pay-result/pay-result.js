// pages/pay-result/pay-result.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
      this.setData({
        payResult: options.flag,
        id: options.id,
        from: options.from
      });
  },

  viewOrder(){
    if (this.data.from == 'my') {
      app.WxApi.redirectTo('/pages/order/order', {
        from: 'order',
        id: this.data.id
      })
    } else {
      app.WxApi.navigateBack()
    }
  }


})