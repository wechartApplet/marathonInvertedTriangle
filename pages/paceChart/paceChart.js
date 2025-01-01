// paceChart.js
Page({
  onLoad: function(options) {
    // 接收从上一个页面传递过来的数据
    const paceData = JSON.parse(options.paceData);
    this.setData({
      paceData: paceData
    });
  },

  // ... 其他函数
});