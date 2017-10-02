const app = getApp();


export default class Address {

  // 获取自己的收获地址
  getAddress() {
    return app.HttpService.getAddress()
      .then(res => {
        if (res) {
          res.totalDetail = this.setAddressInfo(res)
          return res
        }
      })
  }

  // 保存收获地址
  _setUpAddress(res) {
    var formData = {
      name: res.userName,
      province: res.provinceName,
      city: res.cityName,
      country: res.countyName,
      mobile: res.telNumber,
      detail: res.detailInfo
    }
    return formData
  }

  // 更新保存地址
  submitAddress(data) {
    data = this._setUpAddress(data);
    // 返回一个promise
    return app.HttpService.postUserAddress(data)

  }

  // 是否为直辖市
  isCenterCity(name) {
    var centerCitys = ['北京市', '天津市', '上海市', '重庆市'],
      flag = centerCitys.indexOf(name) >= 0;
    return flag;
  }

  /**
   * 根据省市县信息组装地址信息
   * provinceName， province前者为微信选择空间返回结果，后者为查询地址时，自己服务器后台返回结果
   */
  setAddressInfo(res) {
    var province = res.provinceName || res.province,
      city = res.cityName || res.city,
      country = res.countyName || res.country,
      detail = res.detailInfo || res.detail;
    var totalDetail = city + country + detail;
    console.log(res);
    //直辖市，取出省部分
    if (!this.isCenterCity(province)) {
      totalDetail = province + totalDetail;
    };
    return totalDetail;
  }
}