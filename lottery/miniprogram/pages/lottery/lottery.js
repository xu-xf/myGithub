// miniprogram/pages/lottery/lottery.js
import * as echarts from '../../ec-canvas/echarts'
let chart = null
let lotteryitem = [
  { value: 1, name: 'xxf' },
  { value: 1, name: '燕銮' },
  { value: 1, name: '帮主' },
  { value: 1, name: '颂萍' }
]
let aniRound = wx.createAnimation({
  duration: 3000,
  timingFunction: 'ease',
})
let aniSlide = wx.createAnimation({
  duration: 200,
  timingFunction: 'ease-in'
})
Page({
  onShareAppMessage: function (res) {
    return {
      title: 'ECharts 可以在微信小程序中使用啦！',
      path: '/pages/index/index',
      success: function () { },
      fail: function () { }
    }
  },
  data: {
    ec: {
      lazyLoad: true 
    },
    lotteryflag: true,
    aniRoundData: {},
    angle: 0, //总度数
    list: [],
    title: '谁最倒霉',
    reward: 1,
    lotterytype: 'round' //抽奖类型 round 转盘 slide 轮播
  },
  onLoad() {
    // 获取组件
    if (this.data.lotterytype == 'round'){
      this.ecComponent = this.selectComponent('#mychart-dom-bar')
      this.init_pie()
    }
  },
  init_pie() {
    this.ecComponent.init((canvas, width, height) => {
      chart = echarts.init(canvas, null, {
        width: width,
        height: height
      });
      canvas.setChart(chart);
      let option = {
        tooltip: {
          show: false
        },
        color: ['#b8f1ed', '#e7dac9', '#f1f1b8', '#f1b8e4', '#dcff93', '#b7d28d', '#f3d64e', '#f16d7a'],
        series: [
          {
            name: '抽奖项',
            type: 'pie',
            radius: ['0', '100%'],
            avoidLabelOverlap: false,
            hoverAnimation: false,
            animationType: 'scale',
            silent: true,
            label: {
              normal: {
                show: true,
                position: 'inside',
                color: '#333'
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data: lotteryitem
          }
        ]
      };
      chart.setOption(option);
      return chart;
    })
  },
  randomFn(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
  },
  lotteryRound() { //转盘抽奖方式
    let _this = this
    let rdangle = 0  //随机度数
    let angle
    if (_this.data.lotteryflag) {
      rdangle = _this.randomFn(1800, 3600)
      angle = _this.data.angle + rdangle
      aniRound.rotate(angle).step()
      _this.setData({
        aniRoundData: aniRound.export(),
        lotteryflag: false,
        angle
      })
      setTimeout(() => {
        let num = angle % 360 //总度数取余
        let len = lotteryitem.length
        let avg = 360 / len //平均度数
        for(let i = 1; i <= len; i++) {
          if(num <= (avg * i)) {
            let txt
            let reward = _this.data.reward
            if (reward == 0) {
              txt = '恭喜获得' + lotteryitem[i - 1].name
            } else if (reward == 1) {
              txt = _this.data.title + ':非' + lotteryitem[i - 1].name + '莫属啦'
            }
            let list = _this.data.list
            list.push({
              txt: txt
            })
            _this.showModal(txt)
            _this.setData({
              list
            })
            break
          }
        }
        _this.setData({
          lotteryflag: true
        })
      },3000)
    }
  },
  lotterySlide() {  //轮播抽奖方式
    let _this = this
    if (_this.data.lotteryflag) {
      let times = 2 //执行次数
      let i = 0;
      var updownFn = function() {
        if(i <= times) {
          setTimeout(() => {
            aniSlide.translateY('-50%').step()
            aniSlide.translateY(0).step()
            _this.setData({
              aniSlideData: aniSlide.export()
            })
            if(i == times) {
              _this.setData({
                lotteryflag: true
              })
            }
            i++
            updownFn();
          }, (i == 0 ? 0 : 500))
        }
      }
      updownFn();
      _this.setData({
        lotteryflag: false
      })
    }
  },
  showModal(txt) {
    wx.showModal({
      title: '提示',
      content: txt,
      showCancel: false
    })
  }
});
