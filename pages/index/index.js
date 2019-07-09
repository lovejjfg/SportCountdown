//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    progress_txt: '开始倒计时',
    count: 0, // 设置 计数器 初始为0
    totalSecond:30,
    countTimer: null, // 设置 定时器 初始为null
  },
  drawProgressbg: function () {
    // 使用 wx.createContext 获取绘图上下文 context
    var ctx = wx.createCanvasContext('canvasProgressbg')
    ctx.setLineWidth(8);// 设置圆环的宽度
    ctx.setStrokeStyle('#20183b'); // 设置圆环的颜色
    ctx.setLineCap('round') // 设置圆环端点的形状
    ctx.beginPath();//开始一个新的路径
    ctx.arc(110, 110, 100, 0, 2 * Math.PI, false);
    //设置一个原点(110,110)，半径为100的圆的路径到当前路径
    ctx.stroke();//对当前路径进行描边
    ctx.draw();
  },
  drawCircle: function (step) {
    var context = wx.createCanvasContext('canvasProgress');
    // 设置渐变
    var gradient = context.createLinearGradient(200, 100, 100, 200);
    gradient.addColorStop("0", "#2661DD");
    gradient.addColorStop("0.5", "#40ED94");
    gradient.addColorStop("1.0", "#5956CC");

    context.setLineWidth(10);
    context.setStrokeStyle(gradient);
    context.setLineCap('round')
    context.beginPath();
    context.arc(110, 110, 100, -Math.PI / 2, step * Math.PI - Math.PI / 2, false);
    context.stroke();
    context.draw()
  },
  countInterval: function () {
    this.countTimer = setInterval(() => {
      if (this.data.count <= this.data.totalSecond) {
        this.drawCircle(this.data.count / (this.data.totalSecond / 2))
        this.data.count++;
      } else {
        this.setData({
          progress_txt: "结束"
        });
        clearInterval(this.countTimer);
      }
      this.setData({
        progress_txt : this.data.totalSecond - this.data.count
      });
    }, 1000)
  },
  onReady: function () {
    this.drawProgressbg();
    this.countInterval();
  },
})
