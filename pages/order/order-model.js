const app = getApp()

export default class Order {

    constructor() {
        this._storageKeyName = 'newOrder';
    }


    // 下订单
    doOrder(params) {
        return app.HttpService.postOrder({ products: params })
            .then(data => {
                this.execSetStorageSync(true)
                return data
            })
    }


    /*下订单*/
    // qdoOrder(param, callback) {
    //     var that = this;
    //     var allParams = {
    //         url: 'order',
    //         type: 'post',
    //         data: { products: param },
    //         sCallback: function (data) {
    //             that.execSetStorageSync(true);
    //             callback && callback(data);
    //         },
    //         eCallback: function () {
    //         }
    //     };
    //     this.request(allParams);
    // }
    /*
   * 拉起微信支付
   * params:
   * norderNumber - {int} 订单id
   * return：
   * callback - {obj} 回调方法 ，返回参数 可能值 0:商品缺货等原因导致订单不能支付;  1: 支付失败或者支付取消； 2:支付成功；
   * */
    // 这个方法写的还不够好
    execPay(orderNumber) {
        return app.HttpService.postPayOrder({ id: orderNumber })
            .then(res => {
                // 根据服务器返回的时间戳来判断是否可以支付
                var timeStamp = res.timeStamp;
                if (timeStamp) {
                    return new Promise((resolve, reject) => {
                        wx.requestPayment({
                            'timeStamp': timeStamp.toString(),
                            'nonceStr': data.nonceStr,
                            'package': data.package,
                            'signType': data.signType,
                            'paySign': data.paySign,
                            success(){
                                resolve(2)
                            },
                            fali(){
                                resolve(1)
                            }
                        })
                    })
                    // return wx.requestPayment({
                    //     'timeStamp': timeStamp.toString(),
                    //     'nonceStr': data.nonceStr,
                    //     'package': data.package,
                    //     'signType': data.signType,
                    //     'paySign': data.paySign,
                    //     success(){}
                    // })
                } else {
                    return Promise.resolve(0)
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
                // 根据服务器返回的时间戳来判断是否可以支付
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
                    // 服务器自己的原因造成的错误
                    callback && callback(0);
                }
            }
        };
        this.request(allParams);
    }

    /*获得所有订单,pageIndex 从1开始*/
    getOrders(pageIndex) {
        return app.HttpService.getOrderList({page: pageIndex})
    }


    // qgetOrders(pageIndex, callback) {
    //     var allParams = {
    //         url: 'order/by_user',
    //         data: { page: pageIndex },
    //         type: 'get',
    //         sCallback: function (data) {
    //             callback && callback(data);  //1 未支付  2，已支付  3，已发货，4已支付，但库存不足
    //         }
    //     };
    //     this.request(allParams);
    // }
    /*获得订单的具体内容*/
    getOrderInfoById(id) {
        return app.HttpService.getOrderById({id: id})
    }

    /*本地缓存 保存／更新*/
    execSetStorageSync(data) {
        app.WxApi.setStorageSync(this._storageKeyName, data)
    }

    /*是否有新的订单*/
    hasNewOrder() {
        var flag = app.WxApi.getStorageSync(this._storageKeyName)
        return flag == true;
    }


}

