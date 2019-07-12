const app = getApp()
// 运动倒计时完成之后开始休息倒计时，休息倒计时完成之后更新 round 开始新的一轮运动倒计时；
Page({
    data: {
        progress_txt: '开始',
        count: 0, // 设置 计数器 初始为0
        exerciseSeconds: 2,
        restSeconds: 3,
        totalRounds: 2,
        countTimer: null, // 设置 定时器 初始为null
    },
    onReady: function () {
        console.log("onready....")
    },
    navigationStart: function () {
        wx.navigateTo({
            url: '/pages/index/index?exerciseSeconds=' + this.data.exerciseSeconds + '&restSeconds=' + this.data.restSeconds + "&totalRounds=" + this.data.totalRounds,
        })
    },
    bindExercise: function (e) {
        this.setData({
            exerciseSeconds: e.detail.value
        })
    },
    bindRest: function (e) {
        this.setData({
            restSeconds: e.detail.value
        })
    },
    bindRound: function (e) {
        this.setData({
            totalRounds: e.detail.value
        })
    },
    onGotUserInfo: function (e) {
        console.log(e.detail.errMsg)
        console.log(e.detail.userInfo)
        console.log(e.detail.rawData)
    }

});

