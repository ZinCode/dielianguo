class Home{
  constructor(){

  };
  getBannerData(id){
    wx.request({
      // 这里不需要令牌
      url:`http://z.cn/api/v1/banner/${id}`,
      method: 'GET',
      success(res){
        return res;
      }
    })
  }
}

export {Home};