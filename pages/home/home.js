import {Home} from 'home-model.js';
var home = new Home();

Page({
  /**
   * 页面的初始数据
   */
  data:{

  },

  onLoad(){
    this._loadData();
  },

  // 假装是私有的方法
  _loadData(){
    var id = 1;
    var data = home.getBannerData(id);
  }

})
