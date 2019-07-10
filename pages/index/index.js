//index.js
//获取应用实例
const app = getApp()
// 运动倒计时完成之后开始休息倒计时，休息倒计时完成之后更新 round 开始新的一轮运动倒计时；
Page({
    data: {
        progress_txt: '开始',
        count: 0, // 设置 计数器 初始为0
        sportCount: 5,
        restCount: 3,
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
            } else if (this.data.count <= this.data.totalSecond) {
                // 运动倒计时完成，开始休息倒计时
                // clearInterval(this.countTimer);
                this.drawRestCircle((this.data.count - sportCount) / (this.data.restCount / 2))
                this.setData({
                    progress_txt: this.data.restCount - this.data.count + this.data.sportCount
                });
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
        if (this.data.count >= this.data.totalSecond || this.data.count == 0) {
            this.data.count = 1;
            this.countInterval();
        }

    },
    onReady: function () {
        this.data.totalSecond = this.data.sportCount + this.data.restCount
        console.log('totalCount:' + this.data.totalSecond)
        this.drawProgressbg();
    },
})
