import WxValidate from './assets/plugins/wx-validate/WxValidate'
import HttpService from './helpers/HttpService'
import WxApi from './helpers/WxApi'
import __config from './etc/config'


App({
  onLaunch() {
	},
	onShow() {
	},
	onHide() {
	},
  // 可以传入自定义验证规则
  WxValidate: (rules, messages) => new WxValidate(rules, messages),
  WxApi: new WxApi,
  HttpService: new HttpService({
    baseURL: __config.Path
  }),
  __config
})


// 他把模板tpls放到pages这里不太好
// 最后我们要重新修改一下小程序的结构体系
// 变成最基本的思想就是复用
// 包括css 的复用：提取公共样式， html的复用，提取公共模板， js的复用,提取公共代码片段