// pages/addcard/addcard.js
const util = require('../../utils/util.js');
const api = require('../../config/api.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  socket() {
    wx.connectSocket({
      url: 'wss://shop.htmlk.cn/ws',
      header: {
        'content-type': 'application/json'
      },

      success: function (res) {
        console.log(res)
      },
      fail: function (res) {
        console.log(res)
      }
    })
    wx.onSocketOpen(function (res) {
      console.log('WebSocket连接已打开！')
    })
    wx.onSocketError(function (res) {
      console.log('WebSocket连接打开失败，请检查！')
    })
    wx.onSocketMessage(function (res) {
      console.log('收到服务器内容：' + res.data)
    })
  },
  scancodefn() {
    wx.scanCode({
      onlyFromCamera: true,
      scanType: [],
      success: function (res) {
        wx.request({
          url: 'https://shop.htmlk.cn/admin/card/consumeCode?code=' + res.result,
          success: function (res) {
            console.log(res)
            if (res.data.errno == 0 && !res.data.data.code) {
              wx.showToast({
                title: '核销成功',
              })
            } else {
              wx.showToast({
                title: res.data.data.code + '',
              })
            }

          }
        })

      },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  soter: function () {
    wx.checkIsSupportSoterAuthentication({
      success(res) {
        console.log(res)
        // res.supportMode = [] 不具备任何被SOTER支持的生物识别方式
        // res.supportMode = ['fingerPrint'] 只支持指纹识别
        // res.supportMode = ['fingerPrint', 'facial'] 支持指纹识别和人脸识别
      }
    })
  },

  addcard: function () {
    var _that=this
    var userid = wx.getStorageSync('userInfo').id
    util.request(api.CardUrl, { userid: userid }).then(function (res) {
      console.log(res)
      if (res.errno === 0) {
        var ext=JSON.stringify(res.data)
        console.log(ext)
        wx.addCard({
          cardList: [
            {
              cardId: 'pzTUOwre_kmkKAvNkzsyM37TteAE',
              cardExt: ext
            }
          ],
          success: function (res) {
            console.log(res) // 卡券添加结果
            _that.opencard(res)
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

  opencard: function (temp) {
    util.request(api.CardcodeUrl, { code: temp.cardList[0].code}).then(function (res) {
      console.log(res)
      wx.openCard({
        cardList: [
          {
            cardId: temp.cardList[0].cardId,
            code: res.data.codeData
          }
        ],
        success: function (res) {
        }
      })
    });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})