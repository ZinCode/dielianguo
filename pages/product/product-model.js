import { Base } from '../../utils/base.js';

class Product extends Base {
  constructor(){
    super();
  }

  getDetailInfo(id, callback) {
    var params = {
      url: 'product/' + id,
      sCallback(data){
        callback && callback(data)
      }
    }
    console.log('shenmegui')
    this.request(params);
  }
}



export {Product};