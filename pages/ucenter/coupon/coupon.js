var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');



var app = getApp();

Page({
  data: {
    inputValue: '',
    flagval: 'yz123456',
    flagdata: [{
      cardid: 'pzTUOwre_kmkKAvNkzsyM37TteAE',
      pwd: 'yz123456'
    }, {
        cardid: 'pzTUOwhO5LftlcWxMHtmIMixlWeE',
      pwd: '123456'
    }],
    cardListData: []
  },

  clearinput: function () {
    this.setData({
      inputValue: []
    })
  },
  bindKeyInput: function (e) {
    console.log(e.detail.value)
    this.setData({
      inputValue: e.detail.value
    })
  },
  exchange: function () {
    var arr = this.data.flagdata
    var flag=0
    for (var i = 0; i < arr.length; i++) {
      console.log(arr[i].pwd)
      if (this.data.inputValue == arr[i].pwd){
        this.addcard(arr[i].cardId);
        flag=1
      } 
    }
    if(flag==0){
      wx.showToast({
        title: '兑换码无效',
      })
    }
  },
  addcard: function (cardid) {
    console.log(cardid)
    var _that = this
    var userid = wx.getStorageSync('userInfo').id
    util.request(api.CardUrl, { userid: userid,cardid:cardid }).then(function (res) {
      console.log(res)
      if (res.errno === 0) {
        var ext = JSON.stringify(res.data)
        console.log(ext)
        wx.addCard({
          cardList: [
            {
              cardId: cardid,
              cardExt: ext
            }
          ],
          success: function (res) {
            console.log(res) // 卡券添加结果
            res.cardList[0].userid = userid
            _that.addcardinfo(res.cardList[0])
          },
          fail: function (res) {
            console.log(res)
          },
          complete: function (res) {
            console.log(res)
          }
        })
      }
    });
  },
  addcardinfo: function (temp) {
    var _that = this
    util.request(api.addcardUrl, temp, 'POST').then(function (res) {
      console.log(res)
      _that.cardData()
    })
  },

  opencard: function (e) {
    wx.openCard({
      cardList: [
        {
          cardId: e.currentTarget.dataset.cardId,
          code: e.currentTarget.dataset.codeId
        }
      ],
      success: function (res) {
      }
    })
  },
  cardData: function () {
    var _that = this
    var userid = wx.getStorageSync('userInfo').id
    util.request(api.cardlistUrl, { userid: userid }).then(function (res) {
      _that.setData({
        cardListData: res.data.data
      })
    })
  },
  cardpwd:function(){
    var _that = this
    util.request(api.cardpwdUrl).then(function (res) {
      console.log(res)
      _that.setData({
        flagdata: res.data.data
      })
    })
  },
  onLoad: function (options) {
    this.cardpwd()
    this.cardData()
  },

  onReady: function () {

  },
  onShow: function () {

  },
  onHide: function () {
    // 页面隐藏

  },
  onUnload: function () {
    // 页面关闭
  }
})