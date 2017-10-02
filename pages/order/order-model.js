const app = getApp()

export default class Order {

    constructor() {
        this._storageKeyName = 'newOrder';
    }


    // 下订单
    dOrder(params) {
        return app.HttpService.postOrder({ paoducts: params })
            .then(data => {
                this.execSetStorageSync(true)
            })
    }


    /*下订单*/
    qdoOrder(param, callback) {
        var that = this;
        var allParams = {
            url: 'order',
            type: 'post',
            data: { products: param },
            sCallback: function (data) {
                that.execSetStorageSync(true);
                callback && callback(data);
            },
            eCallback: function () {
            }
        };
        this.request(allParams);
    }
    /*
   * 拉起微信支付
   * params:
   * norderNumber - {int} 订单id
   * return：
   * callback - {obj} 回调方法 ，返回参数 可能值 0:商品缺货等原因导致订单不能支付;  1: 支付失败或者支付取消； 2:支付成功；
   * */
    // 这个方法写的还不够好
    execPay(orderNumber) {
        return app.HttpService.postOrder({ id: orderNumber })
            .then(res => {
                var timeStamp = res.timeStamp;
                if (timeStamp) {
                    app.WxApi.requestPayment({
                        'timeStamp': timeStamp.toString(),
                        'nonceStr': data.nonceStr,
                        'package': data.package,
                        'signType': data.signType,
                        'paySign': data.paySign
                    })
                }
            })
    }
    /*
    * 拉起微信支付
    * params:
    * norderNumber - {int} 订单id
    * return：
    * callback - {obj} 回调方法 ，返回参数 可能值 0:商品缺货等原因导致订单不能支付;  1: 支付失败或者支付取消； 2:支付成功；
    * */
    qexecPay(orderNumber, callback) {
        var allParams = {
            url: 'pay/pre_order',
            type: 'post',
            data: { id: orderNumber },
            sCallback: function (data) {
                var timeStamp = data.timeStamp;
                if (timeStamp) { //可以支付
                    wx.requestPayment({
                        'timeStamp': timeStamp.toString(),
                        'nonceStr': data.nonceStr,
                        'package': data.package,
                        'signType': data.signType,
                        'paySign': data.paySign,
                        success: function () {
                            callback && callback(2);
                        },
                        fail: function () {
                            callback && callback(1);
                        }
                    });
                } else {
                    callback && callback(0);
                }
            }
        };
        this.request(allParams);
    }

    // 这个方法可以不用再这里写吧
    getOrders(pageIndex) {
        return app.HttpService.getOrderList({page: pageIndex})
    }

    /*获得所有订单,pageIndex 从1开始*/
    qgetOrders(pageIndex, callback) {
        var allParams = {
            url: 'order/by_user',
            data: { page: pageIndex },
            type: 'get',
            sCallback: function (data) {
                callback && callback(data);  //1 未支付  2，已支付  3，已发货，4已支付，但库存不足
            }
        };
        this.request(allParams);
    }

    getOrderInfoById(id) {
        return app.HttpService.getOrderById({id: id})
    }


    /*获得订单的具体内容*/
    qgetOrderInfoById(id, callback) {
        var that = this;
        var allParams = {
            url: 'order/' + id,
            sCallback: function (data) {
                callback && callback(data);
            },
            eCallback: function () {

            }
        };
        this.request(allParams);
    }

    execSetStorageSync(data) {
        app.WxApi.setStorageSync(this._storageKeyName, data)
    }
    /*本地缓存 保存／更新*/
    qexecSetStorageSync(data) {
        wx.setStorageSync(this._storageKeyName, data);
    };

    hasNewOrder() {
        var flag = app.WxApi.getStorageSync(this._storageKeyName)
        return flag == true;
    }
    /*是否有新的订单*/
    qhasNewOrder() {
        var flag = wx.getStorageSync(this._storageKeyName);
        return flag == true;
    }

}

