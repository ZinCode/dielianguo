const app = getApp()

Page({
  data: {
    transClassArr: ['tanslate0', 'tanslate1', 'tanslate2', 'tanslate3', 'tanslate4', 'tanslate5'],
    currentMenuIndex: 0,
    loadingHidden: false,
    categoryArr: []
  },
  onLoad: function () {
    this.loadData();
  },

  loadData(){
    app.HttpService.getAllCategory()
      .then(res => {
        this.setData({
          categoryArr: res
        })
        app.HttpService.getProductsByCategory({id: res[0].id})
          .then(data => {
            var obj = {
              products: data,
              topImgUrl: res[0].topic_img.url,
              title: res[0].name
            }
            this.setData({
              categoryInfo0: obj
            })
          })
      })
  },


  /*切换分类*/
  changeCategory(e) {
    var data = e.currentTarget.dataset
    var index =data.index
    var id = data.id
    this.setData({
      currentMenuIndex: index
    })

    //如果数据是第一次请求
    if (!this.isLoadedData(index)) {
      var that = this;
      app.HttpService.getProductsByCategory({id: id})
        .then(res => {
          this.setData(that.getDataObjForBind(index, res))
        })
      // this.getProductsByCategory(id, (data) => {
      //   that.setData(that.getDataObjForBind(index, data));
      // });
    }
  },

  // 判断是否是第一次请求
  isLoadedData: function (index) {
    // 判断有没有这个属性
    if (this.data['categoryInfo' + index]) {
      return true;
    }
    return false;
  },

  // 他这种判断方式不好啊
  getDataObjForBind: function (index, data) {
    var obj = {},
      arr = [0, 1, 2, 3, 4, 5],
      baseData = this.data.categoryArr[index];
    for (var item in arr) {
      if (item == arr[index]) {
        obj['categoryInfo' + item] = {
          products: data,
          topImgUrl: baseData.topic_img.url,
          title: baseData.name
        };

        return obj;
      }
    }
  },


  /*跳转到商品详情*/
  onProductsItemTap(e) {
    app.WxApi.navigateTo('/pages/product/product', {
      id: e.currentTarget.dataset.id
    })
  },

  /*下拉刷新页面*/
  onPullDownRefresh: function () {
    // 他这里下拉刷新写的不好
    // this._loadData(() => {
    //   wx.stopPullDownRefresh()
    // });
  },

  //分享效果
  onShareAppMessage: function () {
    return {
      title: '零食商贩 Pretty Vendor',
      path: 'pages/category/category'
    }
  }

})