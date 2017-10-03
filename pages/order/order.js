import Order from '../order/order-model';
import Cart from '../cart/cart-model';
import Address from '../../utils/address';

const order = new Order();
const cart = new Cart();
const address = new Address();
const app = getApp();


Page({

  /**
   * 页面的初始数据
   */
  data: {
    fromCartFlag: true,
    addressInfo: null
  },

  /** 
    * 订单数据来源包括两个：
    * 1.购物车下单
    * 2.旧的订单
    */
  onLoad(options) {
    var flag = options.from == 'cart';
    this.data.fromCartFlag = flag;
    this.data.account = options.account;
    // 来自于购物车
    if (flag) {
      this.setData({
        productsArr: cart.getCartDataFromLocal(true),
        account: options.account,
        orderStatus: 0
      })
      /*显示收获地址*/
      address.getAddress()
        .then(res => {
          this._bindAddressInfo(res);
        })
    }
    else {
      // 旧订单
      this.data.id = options.id
    }
  },

  onShow() {
    if (this.data.id) {
      var id = this.data.id
      order.getOrderInfoById(id)
        .then(data => {
          this.setData({
            orderStatus: data.status,
            productsArr: data.snap_items,
            account: data.total_price,
            basicInfo: {
              orderTime: data.create_time,
              orderNo: data.order_no
            },
          })
          // 快照地址
          var addressInfo = data.snap_address;
          addressInfo.totalDetail = address.setAddressInfo(addressInfo);
          this._bindAddressInfo(addressInfo);
        })
    }
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
        this._bindAddressInfo(addressInfo);
        // 保存地址
        address.submitAddress(res)
          .then(flag => {
            console.log(flag)
            if (!flag) {
              this.showTips('操作提示', '地址信息更新失败！')
            }
          })
      })
  },

  /*绑定地址信息*/
  _bindAddressInfo(addressInfo) {
    this.setData({
      addressInfo: addressInfo
    });
  },

  // 下单和付款
  pay() {
    if (!this.data.addressInfo) {
      this.showTips('下单提示', '请填写您的收货地址');
      return;
    }
    if (this.data.orderStatus == 0) {
      this._firstTimePay();
    } else {
      this._oneMoresTimePay();
    }
  },

  // 第一次支付
  _firstTimePay() {
    var orderInfo = [],
      procuctInfo = this.data.productsArr;
    // 这里为什么要再次new一边呢？
    // order = new Order();
    for (let i = 0; i < procuctInfo.length; i++) {
      orderInfo.push({
        product_id: procuctInfo[i].id,
        count: procuctInfo[i].counts
      });
    }

    // 支付分两步，第一步是生成订单号，然后根据订单号支付
    order.doOrder(orderInfo)
      .then(data => {
        console.log(data)
        if (data.pass) {
          //更新订单状态
          var id = data.order_id;
          this.data.id = id;
          this.data.fromCartFlag = false;

          //开始支付
          this._execPay(id);
        } else {
          this._orderFail(data)   // 下单失败
        }
      })
  },

  /*
   * 提示窗口
   * params:
   * title - {string}标题
   * content - {string}内容
   * flag - {bool}是否跳转到 "我的页面"
   */
  showTips(title, content, flag) {
    app.WxApi.showModal({
      title: title,
      content: content,
      showCancel: false
    }).then(res => {
      if (flag) {
        app.WxApi.switchTab('/pages/my/my')
      }
    })
  },

  /*
   *下单失败
   * params:
   * data - {obj} 订单结果信息
   * */
  _orderFail(data) {
    var nameArr = [],
      name = '',
      str = '',
      pArr = data.pStatusArray;
    for (let i = 0; i < pArr.length; i++) {
      if (!pArr[i].haveStock) {
        name = pArr[i].name;
        if (name.length > 15) {
          name = name.substr(0, 12) + '...';
        }
        nameArr.push(name);
        if (nameArr.length >= 2) {
          break;
        }
      }
    }
    str += nameArr.join('、');
    if (nameArr.length > 2) {
      str += ' 等';
    }
    str += ' 缺货';
    app.WxApi.showModal({
      title: '下单失败',
      content: str,
      showCancel: false
    })
  },

  /* 再次次支付*/
  _oneMoresTimePay: function () {
    this._execPay(this.data.id);
  },

  /*
   *开始支付
   * params:
   * id - {int}订单id
   */
  _execPay(id) {
    // 在这里判断是否演示支付功能
    order.execPay(id)
      .then(statusCode => {
        console.log(statusCode)
        if (statusCode != 0) {
          this.deleteProducts();    // 将已经下单的商品从购物车删除， 

          var flag = statusCode == 2;
          app.WxApi.navigateTo('/pages/pay-result/pay-result', {
            id: id,
            flag: flag,
            from: order
          })
        }
      })
  },

  //将已经下单的商品从购物车删除
  deleteProducts: function () {
    var ids = [], arr = this.data.productsArr;
    for (let i = 0; i < arr.length; i++) {
      ids.push(arr[i].id);
    }
    cart.delete(ids);
  }
})