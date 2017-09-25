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

  // 假装是私有的方法
  _loadData() {
    var id = 1;

    // 获取轮播图数据
    home.getBannerData(id, (res) => {
      this.setData({
        'bannerArr': res
      })
    });

    // 获取精选主题图数据
    home.getThemeData(res=> {
      this.setData({
        'themeArr': res
      })
    })

    // 获取最近新品
    home.getNewProductData( data => {
      this.setData({
        productsArr: data
      })
    })
  }

})

