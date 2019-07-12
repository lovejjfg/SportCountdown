//index.js
//获取应用实例
const countdownPath = 'https://code.aliyun.com/lovejjfg/screenshot/raw/51d63f0524ffcd3d11cf9f7f7ab862e6f0c8a42c/countdown2.mp3';
const finishAudioPath = 'https://code.aliyun.com/lovejjfg/screenshot/raw/51d63f0524ffcd3d11cf9f7f7ab862e6f0c8a42c/finish2.mp3';
// const finishAudioPath = 'https://code.aliyun.com/lovejjfg/screenshot/raw/51d63f0524ffcd3d11cf9f7f7ab862e6f0c8a42c/finish2.mp3';
var localCountdownAudioPath = '';
var localFinishAudioPath = ''
const key_countdown = 'COUNTDOWN_KEY'
const key_fnish = 'COUNTDOWN_FINISH'
const app = getApp()
const audioPlayer = initAudioPlayer()
const canvasContext = initCanvasContext();
const restGradient = initResttGradient();
const exerciseGradient = initExerciseGradient();


function downloadCountDown(innerAudioContext, path, key) {
    wx.downloadFile({
        url: path,
        success(res) {
            // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
            console.log(res)
            if (res.statusCode === 200) {
                wx.saveFile({
                    tempFilePath: res.tempFilePath,
                    success(res) {
                        const resutPath = res.savedFilePath;
                        console.log("resultPath:" + resutPath);
                        // innerAudioContext.src = resutPath
                        wx.setStorage({
                            key: key,
                            data: resutPath
                        })
                        if (countdownPath === path) {
                            localCountdownAudioPath = resutPath;
                        } else {
                            localFinishAudioPath = resutPath
                        }
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

function prepareAudio(innerAudioContext, key, path) {
    try {
        const value = wx.getStorageSync(key);
        if (value) {
            console.log("读取文件成功！！")
            if (key === key_fnish) {
                localFinishAudioPath = value;
            } else {
                localCountdownAudioPath = value;
            }
            // innerAudioContext.src = value;
        } else {
            console.log(" else 读取文件失败！！" + path)
            downloadCountDown(innerAudioContext, path, key);
        }
    } catch (e) {
        console.log(" error 读取文件失败！！" + e)
        downloadCountDown(innerAudioContext, path, key);
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
    prepareAudio(innerAudioContext, key_countdown, countdownPath);
    prepareAudio(innerAudioContext, key_fnish, finishAudioPath);
    return innerAudioContext;
}


function initCanvasContext() {
    return wx.createCanvasContext('canvasProgress');
}

function initExerciseGradient() {
    var gradient = canvasContext.createLinearGradient(200, 0, 0, 200);
    gradient.addColorStop("0", 'red');
    gradient.addColorStop("0.5", 'red');
    gradient.addColorStop("1.0", 'red');
    return gradient;
}

function initResttGradient() {
    var gradient = canvasContext.createLinearGradient(200, 0, 0, 200);
    gradient.addColorStop("0", 'green');
    gradient.addColorStop("0.5", 'green');
    gradient.addColorStop("1.0", 'green');
    return gradient;
}

let roundTotalSeconds = 0;
let currentSecond = 0;
let currentRound = 0;

// 运动倒计时完成之后开始休息倒计时，休息倒计时完成之后更新 round 开始新的一轮运动倒计时；
Page({
    data: {
        progress_txt: '开始',
        exerciseSeconds: 10,
        restSeconds: 20,
        totalRounds: 1,
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
        if (step === 0) {
            console.log("canvas clear ....");
            canvasContext.draw()
            return
        }
        // 设置渐变
        canvasContext.setLineWidth(6);
        canvasContext.setLineCap('round');
        canvasContext.setStrokeStyle(exerciseGradient);
        canvasContext.beginPath();
        canvasContext.arc(100, 100, 80, -Math.PI / 2, step * Math.PI - Math.PI / 2, false);
        canvasContext.stroke();
        canvasContext.draw()
    },
    drawRestCircle: function (step) {
        console.log('drawRestCircle:' + step)
        canvasContext.setLineWidth(6);
        canvasContext.setLineCap('round');
        canvasContext.setStrokeStyle(restGradient);
        canvasContext.setLineWidth(6);
        canvasContext.beginPath();
        canvasContext.arc(100, 100, 80, -Math.PI / 2, step * Math.PI - Math.PI / 2, false);
        canvasContext.stroke();
        canvasContext.draw()
    },

    countInterval: function () {
        this.countTimer = setInterval((format, data) => {
            const exerciseCount = this.data.exerciseSeconds;
            console.log("currentSecond:" + currentSecond + ";;totalSecond:" + roundTotalSeconds);
            if (currentSecond > roundTotalSeconds) {
                currentRound++;
                currentSecond = 1;
                if (currentRound > this.data.totalRounds) {
                    this.setData({
                        progress_txt: "锻炼结束"
                    });
                    clearInterval(this.countTimer);
                    this.drawCircle(0);
                    currentRound = 1;
                    currentSecond = 0;
                    return
                }
            }
            if (currentSecond <= exerciseCount) {
                if (currentSecond < exerciseCount) {
                    this.playDidi(localCountdownAudioPath);
                } else {
                    this.playDidi(localFinishAudioPath);
                }
                this.drawCircle(currentSecond / ((exerciseCount) / 2));
                this.setData({
                    progress_txt: this.data.exerciseSeconds - currentSecond
                }, data);
            } else if (currentSecond <= roundTotalSeconds) {
                if (currentSecond < roundTotalSeconds) {
                    this.playDidi(localCountdownAudioPath);
                } else {
                    this.playDidi(localFinishAudioPath);
                }
                // 运动倒计时完成，开始休息倒计时
                // clearInterval(this.countTimer);
                this.drawRestCircle((currentSecond - exerciseCount) / (this.data.restSeconds / 2));
                this.setData({
                    progress_txt: this.data.restSeconds - currentSecond + this.data.exerciseSeconds
                });
            } else {
                // console.log("currentRound:" + currentRound + ";;totalRound:" + this.data.totalRounds);
                // if (currentRound < this.data.totalRounds) {
                //     currentSecond = 0;
                //     currentRound++;
                // } else {
                //     this.setData({
                //         progress_txt: "锻炼结束"
                //     });
                //     clearInterval(this.countTimer);
                //     this.drawCircle(0);
                // }

            }
            currentSecond++;
        }, 1000)
    },
    resetClick: function () {
        console.log(currentSecond + ';;' + roundTotalSeconds);
        if (currentSecond === 0) {
            currentSecond = 1;
            this.countInterval();
        }

    },
    playDidi: function (path) {
        audioPlayer.src = path;
        audioPlayer.stop();
        audioPlayer.play()


    },
    onReady: function () {
        console.log("onready....")
        roundTotalSeconds = this.data.exerciseSeconds + this.data.restSeconds
        console.log('totalCount:' + roundTotalSeconds)
        this.drawProgressbg();
    },
    onLoad: function (option) {
        console.log(option)
        this.setData({
            exerciseSeconds: parseInt(option.exerciseSeconds),
            restSeconds: parseInt(option.restSeconds),
            totalRounds: parseInt(option.totalRounds)
        })
        roundTotalSeconds = this.data.exerciseSeconds + this.data.restSeconds
        currentRound = 1
        // const eventChannel = this.getOpenerEventChannel()
        // eventChannel.emit('acceptDataFromOpenedPage', {data: 'test'});
        // eventChannel.emit('someEvent', {data: 'test'});
        // 监听acceptDataFromOpenerPage事件，获取上一页面通过eventChannel传送到当前页面的数据
        // eventChannel.on('acceptDataFromOpenerPage', function(data) {
        //     console.log(data)
        // })
    }

});

