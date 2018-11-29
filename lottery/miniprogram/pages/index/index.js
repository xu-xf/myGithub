//index.js
const app = getApp()

Page({
  data: {
    additem: [],
    pophide: true,
    rewardTxt: [
      '恭喜获得xxx',
      '非xxx莫属啦'
    ],
    index: 0,
  },
  onLoad: function() {
    if (app.globalData.openid) {
      this.setData({
        openid: app.globalData.openid
      })
    }
    console.log(app.globalData.openid)
    // wx.cloud.callFunction({
    //   name: 'login',
    //   data: {},
    //   success: res => {
    //     app.globalData.openid = res.result.openid
    //     this.setData({
    //       step: 2,
    //       openid: res.result.openid
    //     })
    //   },
    //   fail: err => {
    //     wx.showToast({
    //       icon: 'none',
    //       title: '获取 openid 失败，请检查是否有部署 login 云函数',
    //     })
    //     console.log('[云函数] [login] 获取 openid 失败，请检查是否有部署云函数，错误信息：', err)
    //   }
    // })
    let additem = []
    for(let i = 0; i < 2; i++) {
      let time = new Date().getTime() + i
      additem.push(time)
    }
    this.setData({
      additem
    })
  },
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },
  addinput(e) {
    let additem = this.data.additem
    let i = e.currentTarget.dataset.id
    let time = new Date().getTime()
    let newitem = [];
    if(additem.indexOf(time) == -1) { //避免生成重复id
      for (var j = 0; j < additem.length; j++) {
        newitem.push(additem[j])
        if (additem[j] == i) {
          newitem.push(time)
        }
      }
      console.log(newitem)
      this.setData({
        additem: newitem
      })
    }
  },
  deleteinput(e) {
    let additem = this.data.additem
    if(additem.length > 2) {
      let i = e.currentTarget.dataset.id
      let newitem = additem.filter(function (item) {
        return item != i
      })
      this.setData({
        additem: newitem
      })
    }
  },
  popshowhide() {
    this.setData({
      pophide: !this.data.pophide
    })
  },
  formSubmit(e) {
    var detail = e.detail.value
    var param = {
      lotteryitem: []
    };
    if (detail.title == '') {
      this.showModal('标题不为空')
      return
    }
    for(var item in detail) { //组合提交项，将参与抽奖项组合成数组
      var len = item.split('lotteryitem').length
      if(len > 1) {
        if (detail[item] != '') {
          param.lotteryitem.push({
            name: detail[item],
            value: 1
          })
        }
      }else {
        param[item] = detail[item]
      }
    }
    if (param.lotteryitem.length < 2) {
      this.showModal('至少有两项抽奖项')
      return
    }
    console.log(param)
  },
  showModal(txt) {
    wx.showModal({
      title: '提示',
      content: txt,
      showCancel: false
    })
  }
})
