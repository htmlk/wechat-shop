const util = require('../../utils/util.js');
const api = require('../../config/api.js');
const user = require('../../services/user.js');

//获取应用实例
const app = getApp()
Page({
  data: {
    newGoods: [],
    hotGoods: [],
    topics: [],
    brands: [],
    floorGoods: [],
    banner: [],
    channel: []
  },
  onShareAppMessage: function () {
    return {
      title: '逸住商城',
      desc: '逸住商城小程序',
      path: '/pages/index/index'
    }
  },
  showDialog() {
    this.login.showlogin();
  },
  getIndexData: function () {
    let that = this;
    util.request(api.IndexUrl).then(function (res) {
      if (res.errno === 0) {
        that.setData({
          // newGoods: res.data.newGoodsList,
          hotGoods: res.data.hotGoodsList,
          // topics: res.data.topicList,
          brand: res.data.brandList,
          // floorGoods: res.data.categoryList,
          banner: res.data.banner,
          channel: res.data.channel
        });
      }
    });
  },
  onLoad: function (options) {
    this.getIndexData();
    this.goLogin()
    this.login = this.selectComponent("#login");
  },
  /**
   * 商城登录态管理
   */
  //确认事件
  _confirmEvent() {   
    var _that = this
    wx.openSetting({
      success: (res) => {
        console.log(res)
        if (res.authSetting['scope.userInfo']) {
          _that.goLogin()
          _that.login.hideDialog();
        }

      }
    })
  },
  //立即登录
  goLogin() {
    var _that=this
    user.loginByWeixin().then(res => {
      this.setData({
        userInfo: res.data.userInfo
      });
      app.globalData.userInfo = res.data.userInfo;
      app.globalData.token = res.data.token;
    }).catch((err) => {
      _that.login.hideDialog();
    });
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },
})
