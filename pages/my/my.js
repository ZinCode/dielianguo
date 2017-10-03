import Address from '../../utils/address';
import Order from '../order/order-model'

var address = new Address();
var order = new Order();
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageIndex: 1,
    isLoadedAll: false,
    loadingHidden: false,
    orderArr: [],
    addressInfo: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.loadData()
  },
  loadData() {
    app.WxApi.login()
      .then(_ => {
        app.WxApi.getUserInfo()
          .then(res => {
            this.setData({
              userInfo: res.userInfo
            })
            this.getOrders()
            order.execSetStorageSync(false);  //更新标志位
          })
      })
  },
  // 订单信息
  getOrders() {
    return order.getOrders(this.data.pageIndex)
      .then(res => {
        var data = res.data
        this.setData({
          loadingHidden: true
        })
        if (data.length > 0) {
          this.data.orderArr.push.apply(this.data.orderArr, res.data) // 合并数组
          this.setData({
            orderArr: this.data.orderArr
          })
        } else {
          this.data.isLoadedALL = true;     // 已经全部加载完毕
          this.data.pageIndex = 1
        }
      })
  },

  // 地址信息
  getAddressInfo() {
    address.getAddress()
      .then(addressInfo => {
        this._bindAddressInfo(addressInfo)
      })
  },

  // 绑定地址信息
  _bindAddressInfo(addressInfo) {
    this.setData({
      addressInfo: addressInfo
    })
  },

  // 修改或添加地址信息
  editAddress() {
    app.WxApi.chooseAddress()
      .then(res => {
        var addressInfo = {
          name: res.userName,
          mobile: res.telNumber,
          totalDetail: address.setAddressInfo(res)
        };
        if (res.telNumber) {
          this._bindAddressInfo(addressInfo)
          // 保存地址
          address.submitAdderss()
            .then(flag => {
              if (!flag) {
                this.showTips('操作提示', '地址信息更新失败!')
              }
            })
        } else {
          this.showTips('操作提示', '地址信息更新失败,手机号码信息为空！')
        }
      })
  },

  // 显示订单的具体信息
  showOrderDetailInfo(e) {
    app.WxApi.navigateTo('/pages/order/order', {
      from: 'order',
      id: e.currentTarget.dataset.id
    })
  },

  // 未支付订单再次支付
  repay(e) {
    var data = e.currentTarget.dataset,
      id = data.id,
      index = data.index;
    // 支付操作
    this._execPay(id, index)
  },

  // 支付
  _execPay(id, index) {
    order.execPay(id)
      .then(res => {
        console.log(res)
        if (res > 0) {
          var flag = res == 2
          // 更新订单显示状态
          if (flag) {
            this.data.orderArr[index].status = 2;
            this.setData({
              orderArr: this.data.orderArr
            })
          }
          // 跳转到成功页面
          app.WxApi.navigateTo('/pages/pay-result/pay-result', {
            id: id,
            flag: flag,
            from: my
          })
        } else {
          this.showTips('支付失败', '商品已下架或库存不足');
        }
      })
  },

  // 下拉刷新
  onPullDownRefresh() {
    this.data.orderArr = [];    // 订单初始化
    this.getOrders()
      .then(_ => {
        this.data.isLoadedALL = false; // 是否加载完全
        this.data.pageIndex = 1;
        app.WxApi.stopPullDownRefresh();
        order.execSetStorageSync(false)     // 更新标志位
      })
  },

  // 滑动到底部刷新
  onReachBottom() {
    if (!this.data.isLoadedAll) {
      this.data.pageIndex++;
      this.getOrders()
    }
  },

  /*
   * 提示窗口
   * params:
   * title - {string}标题
   * content - {string}内容
   * flag - {bool}是否跳转到 "我的页面"
   */
  showTips: function (title, content) {
    wx.WxApi.showModal({
      title: title,
      content: content,
      showCancel: false
    })
  },

})