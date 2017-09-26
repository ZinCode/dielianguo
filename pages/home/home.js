import { Home } from 'home-model.js';
var home = new Home();

Page({
  /**
   * 页面的初始数据
   */
  data: {},

  onLoad() {
    this._loadData();
  },

  // 假装是私有的方法, 相当于只获取页面数据
  _loadData() {
    var id = 1;

    // 获取轮播图数据
    home.getBannerData(id, (res) => {
      this.setData({
        'bannerArr': res
      })
    });

    // 获取精选主题图数据
    home.getThemeData(res => {
      this.setData({
        'themeArr': res
      })
    })

    // 获取最近新品
    home.getNewProductData(data => {
      this.setData({
        productsArr: data
      })
    })
  },

  // 点击banneritem图片
  onProductsItemTap(e) {
    var id = home.getDataSet(e, 'id')
    wx.navigateTo({
      url: '../product/product?id=' + id
    })
  },

  // 点击主题图片跳转
  onThemesItemTap(e){
    var id = home.getDataSet(e, 'id');
    var name = home.getDataSet(e, 'name');
    wx.navigateTo({
      url: '../theme/theme?id=' + id + '&name=' + name
    })
  }

})

