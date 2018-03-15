var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
const pay = require('../../../services/pay.js');

var app = getApp();

Page({
  data: {
    checkedGoodsList: [],
    checkedAddress: {},
    checkedCoupon: [],
    couponList: [],
    goodsTotalPrice: 0.00, //商品总价
    freightPrice: 0.00,    //快递费
    couponPrice: 0.00,     //优惠券的价格
    orderTotalPrice: 0.00,  //订单总价
    actualPrice: 0.00,     //实际需要支付的总价
    addressId: 0,
    couponId: 0,
    switchAddressflag: 0,
    roomNo: '',
    roomName: '',
    roomPhone: '',
    sectionarray: ['一间科技酒店深圳分店', '深圳华侨城酒店', '深圳七天连锁酒店', '广州维也纳酒店'],
    sectionindex: 0,
    hoteltime:'0.00-24.00',
    multiIndex: [0, 0, 0],
    multiArray: [[], ['-'], []],
  },
  switchAddressfn: function () {
    this.setData({
      switchAddressflag: this.data.switchAddressflag ? 0 : 1
    })
    wx.setStorageSync('switchAddressflag', this.data.switchAddressflag ? 1 : 0)
  },
  roomNotap:function(e){
    console.log(e.detail.value)
    this.setData({
      roomNo: e.detail.value
    })
  },
  roomNametap: function (e) {
    console.log(e)
    this.setData({
      roomName: e.detail.value
    })
  },
  roomPhonetap: function (e) {
    console.log(e)
    this.setData({
      roomPhone: e.detail.value
    })
  },
  bindMultiPickerChange: function (e) {
    var that=this
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      multiIndex: e.detail.value
    })
   
  
    this.setData({
      hoteltime: that.data.multiArray[0][e.detail.value[0]] + '-' + that.data.multiArray[2][e.detail.value[2]]
    })
    console.log(that.data.hoteltime)
  },
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      sectionindex: e.detail.value
    })
  },
  bindMultiPickerColumnChange: function (e) {
    var that=this
   
   
    this.timefn(e.detail.column, e.detail.value)
  },
  //时间段选择
  timefn: function (col, val) {
    var timeArr0 = []
    var timeArr2 = []
    var timeArrObj = []
    if (col == 0) {
      for (var i = 0; i < 24; i++) {
        timeArr0.push(i + ':00')
      }
      for (var j = val; j <= 24; j++) {
        timeArr2.push(j + ':00')
      }

      timeArrObj[0] = timeArr0
      timeArrObj[1] = ['-']
      timeArrObj[2] = timeArr2

      this.setData({
        multiArray: timeArrObj
      })
    }


  },
  onLoad: function (options) {
    this.timefn(0, 24)

    // 页面初始化 options为页面跳转所带来的参数

    try {
      var addressId = wx.getStorageSync('addressId');
      if (addressId) {
        this.setData({
          'addressId': addressId
        });
      }

      var couponId = wx.getStorageSync('couponId');
      if (couponId) {
        this.setData({
          'couponId': couponId
        });
      }
    } catch (e) {
      // Do something when catch error
    }


  },
  getCheckoutInfo: function () {
    let that = this;
    console.log(that.data)
    var data = {
      addressId: that.data.addressId,
      couponId: that.data.couponId,
      switchAddressflag: that.data.switchAddressflag,
      hotelName: that.data.sectionarray[that.data.sectionindex],
      hoteltime: that.data.hoteltime,
      roomNo: that.data.roomNo,
      roomName: that.data.roomName,
      roomPhone: that.data.roomPhone
    }
    console.log(data)
    util.request(api.CartCheckout, data).then(function (res) {
      if (res.errno === 0) {
        console.log(res.data);
        that.setData({
          checkedGoodsList: res.data.checkedGoodsList,
          checkedAddress: res.data.checkedAddress,
          actualPrice: res.data.actualPrice,
          checkedCoupon: res.data.checkedCoupon,
          couponList: res.data.couponList,
          couponPrice: res.data.couponPrice,
          freightPrice: res.data.freightPrice,
          goodsTotalPrice: res.data.goodsTotalPrice,
          orderTotalPrice: res.data.orderTotalPrice
        });
      }
      wx.hideLoading();
    });
  },
  selectAddress() {
    wx.navigateTo({
      url: '/pages/shopping/address/address',
    })
  },
  addAddress() {
    wx.navigateTo({
      url: '/pages/shopping/addressAdd/addressAdd',
    })
  },
  onReady: function () {
    // 页面渲染完成

  },
  onShow: function () {
    // 页面显示
    wx.showLoading({
      title: '加载中...',
    })
    this.getCheckoutInfo();
    try {
      var switchAddressflag = wx.getStorageSync('switchAddressflag')
    } catch (e) {
      var switchAddressflag = 0
    }

    this.setData({
      switchAddressflag: switchAddressflag
    })
  },
  onHide: function () {
    // 页面隐藏

  },
  onUnload: function () {
    // 页面关闭

  },
  submitOrder: function () {
    var that=this
   
    if (that.data.switchAddressflag==0){
      if (that.data.roomNo==''){
        util.showErrorToast('请填写房间号');
        return false;
      }
      if (that.data.roomName==''){
        util.showErrorToast('请填写收货人');
        return false;
      }
      if (that.data.roomPhone==''){
        util.showErrorToast('请填写手机号');
        return false;
      }
    }else{
      if (this.data.addressId <= 0) {
        util.showErrorToast('请选择收货地址');
        return false;
      }
    }
    var data = {
      addressId: that.data.addressId,
      couponId: that.data.couponId,
      switchAddressflag: that.data.switchAddressflag,
      hotelName: that.data.sectionarray[that.data.sectionindex],
      hoteltime: that.data.hoteltime,
      roomNo: that.data.roomNo,
      roomName: that.data.roomName,
      roomPhone: that.data.roomPhone
    }
    console.log(data)
    util.request(api.OrderSubmit, data, 'POST').then(res => {
      if (res.errno === 0) {
        const orderId = res.data.orderInfo.id;
        pay.payOrder(parseInt(orderId)).then(res => {
          wx.redirectTo({
            url: '/pages/payResult/payResult?status=1&orderId=' + orderId
          });
        }).catch(res => {
          wx.redirectTo({
            url: '/pages/payResult/payResult?status=0&orderId=' + orderId
          });
        });
      } else {
        util.showErrorToast('下单失败');
      }
    });
  }
})