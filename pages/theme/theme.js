const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    themeInfo: {}
  },

  onLoad: function (options) {
    var id = options.id;
    var name = options.name;
    this.data.id = id;
    this.data.name = name;


    this._loadData();

  },


  onReady() {
    // 动态设置标题栏
    // 最好设置在onReady中  https://mp.weixin.qq.com/debug/wxadoc/dev/framework/app-service/page.html
    app.WxApi.setNavigationBarTitle({
      title: decodeURI(this.data.name)
    })
  },

  _loadData() {
    app.HttpService.getThemeById({ id: this.data.id })
      .then(res => {
        this.setData({
          themeInfo: res
        })
      })
  },
  // 点击某件商品图片
  onProductsItemTap(e) {
    app.WxApi.navigateTo('/pages/product/product', {
      id: e.currentTarget.dataset.id
    })
  },

  //分享效果
  onShareAppMessage() {
    return {
      title: '蝶恋果 Butterfly Love Fruits',
      path: 'pages/theme/theme?id=' + this.data.id + '&name=' + this.data.name
    }
  }

})