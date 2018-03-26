var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');

Page({
  data:{
    orderList: []
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数

    this.getOrderList();
  },
  getOrderList(){
    let that = this;
    util.request(api.OrderList).then(function (res) {
      if (res.errno === 0) {
        console.log(res.data);
        that.setData({
          orderList: res.data.data
        });
      }
    });
  },
  payOrder(e){
    console.log(this.data.orderList[e.target.dataset.orderIndex].id)
    console.log(e.target.dataset.orderIndex)
    wx.redirectTo({
I
    });
  },
  payOrder(e){

    console.log(e.target.dataset.orderIndex)
    var orderinfo = this.data.orderList[e.target.dataset.orderIndex]
    wx.redirectTo({
      url: '/pages/pay/pay?orderId=' + orderinfo.id + '&actualPrice=' + orderinfo.actual_price,
    })
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  }
})