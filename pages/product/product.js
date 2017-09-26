// pages/product/product.js
import { Product } from 'product-model.js';
var product = new Product;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: null,
    countsArray: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    productCount: 1,
    currentTabsIndex: 0,
    tabBoxArr: ['商品详情', '产品参数', '售后保障']
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var id = options.id
    this.data.id = id;
    this._loadData();
  },

  _loadData() {
    product.getDetailInfo(this.data.id, data => {
      this.setData({
        product: data
      })
    })
  },

  // 选择购物数量
  bindPickerChange(e) {
    var index = e.detail.value;
    var selectedCount = this.data.countsArray[index]
    this.setData({
      productCount: selectedCount
    })
  },

  // 切换详情mianban
  onTabsItemTap(e) {
    var index = product.getDataSet(e, 'index')
    console.log(index)
    this.setData({
      currentTabsIndex: index
    })
  }


})