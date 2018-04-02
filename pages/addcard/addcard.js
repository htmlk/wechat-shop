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
  scancodefn(){
    wx.scanCode({
      onlyFromCamera: true,
      scanType: [],
      success: function (res) {
        wx.request({
          url: 'https://shop.htmlk.cn/admin/card/consumeCode?code='+res.result,
          success:function(res){
            console.log(res)
            if(res.data.errno==0&&!res.data.data.code){
              wx.showToast({
                title: '核销成功',
              })
            }else{
              wx.showToast({
                title: res.data.data.code+'',
              })
            }
            
          }
        })
        
      },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  soter:function(){
    wx.checkIsSupportSoterAuthentication({
      success(res) {
        console.log(res)
        // res.supportMode = [] 不具备任何被SOTER支持的生物识别方式
        // res.supportMode = ['fingerPrint'] 只支持指纹识别
        // res.supportMode = ['fingerPrint', 'facial'] 支持指纹识别和人脸识别
      }
    })
  },

  addcard:function(){
    var userid=wx.getStorageSync('userInfo').id
    console.log(userid)
    
    var timestamp = new Date().getTime()
   

    
    var Ext = JSON.stringify({ timestamp: '1521706787315', signature: '64874b16615fc29ddd3cb1f7b857375612825fda' })
        console.log(Ext)
        wx.addCard({
          cardList: [
            {
              cardId: 'pzTUOwhO5LftlcWxMHtmIMixlWeE',
              cardExt: '{"timestamp": "1521707765", "signature":"c48051f6420d21b1483c31528a46142e5c034504"}'
            }
          ],
          success: function (res) {
            console.log(res) // 卡券添加结果
          },
          fail:function(res){
            console.log(res)
          },
          complete:function(res){
            console.log(res)
          }
        })
    //     util.request(api.CardUrl, { userid: userid }).then(function (res) {


    //       if (res.errno === 0) {
    //   }

    // });


    
  },
  opencard:function(){
    wx.openCard({
      cardList: [
        {
          cardId: 'pzTUOwhO5LftlcWxMHtmIMixlWeE',
          code: ''
        }
      ],
      success: function (res) {
      }
    })
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