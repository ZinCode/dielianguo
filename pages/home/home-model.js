import { Base } from '../../utils/base.js';

class Home extends Base {
  constructor() {
    super();
  };

  // 获取轮播数据
  getBannerData(id, callback) {
    var params = {
      url: 'banner/' + id,
      sCallback(res) {
        // 这里可以用es6的语法
        res = res.items
        callback && callback(res);
      }
    }
    this.request(params);
  }

  // 获取首页主题
  getThemeData(callback){
    var params = {
      url: 'theme?ids=1,2,3',
      sCallback(data){
        callback && callback(data);
      }
    }
    this.request(params);
  }

  // 获取最新商品
  getNewProductData(callback){
    var params = {
      url: 'product/recent',
      sCallback(data){
        callback && callback(data);
      }
    }
    this.request(params);
  }
}

export { Home };


// 他的小程序架构不是太好，还有有很多重复，所以我们要重构一下