// pages/theme/theme.js
import { Theme } from 'theme-model.js';
var theme = new Theme();

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 他这个小程序写的不好，需要改一下
    var id = options.id;
    var name = options.name;
    this.data.id = id;
    this.data.name = name;


    this._loadData();

  },


  onReady() {
    // 动态设置标题栏
    // 最好设置在onReady中  https://mp.weixin.qq.com/debug/wxadoc/dev/framework/app-service/page.html
    wx.setNavigationBarTitle({
      title: this.data.name
    })
  },

  _loadData() {
    theme.getProductsData(this.data.id, (data) => {
      this.setData({
        themeInfo: data
      })
    })
  }

})