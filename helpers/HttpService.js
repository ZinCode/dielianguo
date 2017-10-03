import WxRequest from 'WxRequest';

export default class HttpService extends WxRequest{
  constructor(options){
    super(options)
    // 这里有动态路由怎么办
    this.$$path = {
      banner:                         '/banner',
      theme:                          '/theme',
      productRecent:                  '/product/recent',
      productsByCategory:              '/product/by_category',
      productById:                    '/product',
      category:                       '/category/all',
      userToken:                      '/token/user',
      verifyToken:                    '/token/verify',
      address:                        '/address',
      order:                          '/order',
      orderByUser:                    '/order/by_user',
      payOrder:                       '/pay/pre_order'
    }
  }

  // 获取指定banner图
  getBannerById(params) {
    var id = params.id
    var url = `${this.$$path.banner}/${id}`
    return this.request('GET', url)
  }
  
  // 获取theme列表信息
  getThemeList(params){
    return this.request('GET', this.$$path.theme, params)
  }

  // 获取指定theme下的列表信息
  getThemeById(params) {
    var id = params.id;
    var url = `${this.$$path.theme}/${id}`
    return this.request('GET', url)
  }

  // 获取某种分类下的商品
  getProductsByCategory(params) {
    return this.request('GET', this.$$path.productsByCategory,params)
  }

  // 获取指定id的商品
  getProductById(params) {
    var id = params.id
    var url = `${this.$$path.productById}/${id}`
    return this.request('GET', url)
  }

  // 获取最近新品
  getRecentProducts() {
    return this.request('GET', this.$$path.productRecent)
  }

  // 获取商品的所有分类
  getAllCategory() {
    return this.request('GET', this.$$path.category)
  }

  // 获取登录Token
  postUserToken(params) {
    return this.request('POST', this.$$path.userToken, params)
  }

  // 验证token准确性
  postVerifyToken(params) {
    return this.request('POST', this.$$path.verifyToken, params)
  }

  // 获取收货地址
  getUserAddress() {
    return this.request('GET', this.$$path.address)
  }

  // 更新收货地址
  postUserAddress(params) {
    return this.request('POST', this.$$path.address, params)
  }

  // 提交订单
  postOrder(params) {
    return this.request('POST', this.$$path.order, params)
  }

  // 根据id获取订单详情
  getOrderById(params) {
    var id = params.id
    var url =  `${this.$$path.order}/${id}`
    return this.request('GET', url)
  }

  // 获取订单列表（分页）
  getOrderList(params) {
    return this.request('GET', this.$$path.orderByUser, params)
  }

  // 支付订单
  postPayOrder(params) {
    return this.request('POST', this.$$path.payOrder, params)
  }
}