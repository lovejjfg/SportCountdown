//index.js
//获取应用实例
const app = getApp()
const audioPlayer = initAudioPlayer()

function downloadCountDown(innerAudioContext) {
    wx.downloadFile({
        url: 'https://code.aliyun.com/lovejjfg/screenshot/raw/0e1c3c98eb7ff03c596e41530ed93b8bdaf7da8e/countdown.mp3',
        success(res) {
            // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
            console.log(res)
            if (res.statusCode === 200) {
                wx.saveFile({
                    tempFilePath: res.tempFilePath,
                    success(res) {
                        const resutPath = res.savedFilePath;
                        console.log("resultPath:" + resutPath);
                        innerAudioContext.src = resutPath
                        wx.setStorage({
                            key: "resultPath",
                            data: resutPath
                        })

                    }
                })
                // console.log('path:' + res.tempFilePath)

            }
        },
        fail(error) {
            console.log(error)
        }
    })
}

function prepareAudio(innerAudioContext) {
    try {
        const value = wx.getStorageSync('resultPath');
        if (value) {
            console.log("读取文件成功！！")
            innerAudioContext.src = value;
        } else {
            console.log(" else 读取文件失败！！")
            downloadCountDown(innerAudioContext);
        }
    } catch (e) {
        console.log(" error 读取文件失败！！" + e)
        downloadCountDown(innerAudioContext);
    }
}

function initAudioPlayer() {
    const innerAudioContext = wx.createInnerAudioContext();
    innerAudioContext.autoplay = false;
    innerAudioContext.loop = false;
    innerAudioContext.volume = 1;
    innerAudioContext.onPlay(() => {
        console.log('开始播放')
    });
    innerAudioContext.onError((res) => {
        console.log(res.errMsg)
        console.log(res.errCode)
    });
    prepareAudio(innerAudioContext);
    return innerAudioContext;
}


// 运动倒计时完成之后开始休息倒计时，休息倒计时完成之后更新 round 开始新的一轮运动倒计时；
Page({
    data: {
        progress_txt: '开始',
        count: 0, // 设置 计数器 初始为0
        sportCount: 15,
        restCount: 10,
        totalSecond: 0,
        countTimer: null, // 设置 定时器 初始为null
    },
    drawProgressbg: function () {
        // 使用 wx.createContext 获取绘图上下文 context
        var ctx = wx.createCanvasContext('canvasProgressbg')
        ctx.setLineWidth(4); // 设置圆环的宽度
        ctx.setStrokeStyle('#eee'); // 设置圆环的颜色
        ctx.setLineCap('round') // 设置圆环端点的形状
        ctx.beginPath(); //开始一个新的路径
        ctx.arc(100, 100, 80, 0, 2 * Math.PI, false);
        //设置一个原点(110,110)，半径为100的圆的路径到当前路径
        ctx.stroke(); //对当前路径进行描边
        ctx.draw();
    },
    drawCircle: function (step) {
        console.log('drawCircle:' + step)

        var context = wx.createCanvasContext('canvasProgress');
        if (step == 0) {
            console.log("canvas clear ....");
            context.draw()
            return
        }
        // 设置渐变
        var gradient = context.createLinearGradient(200, 0, 0, 200);
        gradient.addColorStop("0", 'red');
        gradient.addColorStop("0.5", 'red');
        gradient.addColorStop("1.0", 'red');
        context.setLineWidth(6);
        context.setStrokeStyle(gradient);
        context.setLineCap('round')
        context.beginPath();
        context.arc(100, 100, 80, -Math.PI / 2, step * Math.PI - Math.PI / 2, false);
        context.stroke();
        context.draw()
    },
    drawRestCircle: function (step) {
        console.log('drawRestCircle:' + step)
        var context = wx.createCanvasContext('canvasProgress');
        var gradient = context.createLinearGradient(200, 0, 0, 200);
        gradient.addColorStop("0", 'green');
        gradient.addColorStop("0.5", 'green');
        gradient.addColorStop("1.0", 'green');
        context.setLineWidth(6);
        context.setStrokeStyle(gradient);
        context.setLineCap('round')
        context.beginPath();
        context.arc(100, 100, 80, -Math.PI / 2, step * Math.PI - Math.PI / 2, false);
        context.stroke();
        context.draw()
    },

    countInterval: function () {
        this.countTimer = setInterval((format, data) => {
            var sportCount = this.data.sportCount
            if (this.data.count <= sportCount) {
                this.drawCircle(this.data.count / ((sportCount) / 2))
                this.setData({
                    progress_txt: this.data.sportCount - this.data.count
                }, data);
                this.playDidi();
            } else if (this.data.count <= this.data.totalSecond) {
                // 运动倒计时完成，开始休息倒计时
                // clearInterval(this.countTimer);
                this.drawRestCircle((this.data.count - sportCount) / (this.data.restCount / 2))
                this.setData({
                    progress_txt: this.data.restCount - this.data.count + this.data.sportCount
                });
                this.playDidi();
            } else {
                this.setData({
                    progress_txt: "开始"
                });
                clearInterval(this.countTimer);
                this.drawCircle(0);
            }
            this.data.count++;
        }, 1000)
    },
    resetClick: function (event) {
        console.log(this.data.count + ';;' + this.data.totalSecond);
        if (this.data.count >= this.data.totalSecond || this.data.count === 0) {
            this.data.count = 1;
            this.countInterval();
        }

    },
    playDidi: function () {
        audioPlayer.stop()
        audioPlayer.play()


    },
    onReady: function () {
        this.data.totalSecond = this.data.sportCount + this.data.restCount
        console.log('totalCount:' + this.data.totalSecond)
        this.drawProgressbg();
    },

});

