// index.js
// 用户没有上传头像时的占位图
const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0';
// 导入时间的数值
const timePicker = require('../../utils/timePicker.js');
// 导入距离的数值
const distancePicker = require('../../utils/distancePicker.js');
// 导入公共的函数
const common = require('../../utils/common.js');

// pages/index/index.js
Page({
    data: {
        timeOptions: [], // 示例时间选项
        selectedIndex: 0, // 默认选择的索引
        initialTimeIndex: 0, // 默认初始时间索引
        sprintTimeIndex: 0, // 默认冲刺时间索引
        distanceIndex: 0   // 默认距离索引
    },
    onLoad: function () {
        // 加载时将生成的时间值和距离值进行对应的赋值
        this.setData({
            timeOptions: timePicker.generateTimeList(),
            distanceOptions: distancePicker.generateDistanceOptions()
        });
        this.setDefaultIndices();
    },

    // 设置默认的初始配速 和 冲刺配速 和 运动距离
    setDefaultIndices: function () {
        const initialIndex = common.getIndex('06:30', this.data.timeOptions);
        const sprintIndex = common.getIndex('04:30', this.data.timeOptions);
        //  这里必须得是数字
        const distanceIndex = common.getIndex(21.0975, this.data.distanceOptions);
        this.setData({
            initialTimeIndex: initialIndex !== -1 ? initialIndex : 0,
            sprintTimeIndex: sprintIndex !== -1 ? sprintIndex : 0,
            distanceIndex: distanceIndex !== -1 ? distanceIndex : 0
        });
    },

    // 当用户选择及时更新页面
    bindPickerChange: function (e) {
        this.setData({
            selectedIndex: e.detail.value
        });
        const type = e.currentTarget.dataset.type; // 'initial' 或 'sprint' 或 'distance'
        const index = e.detail.value;
        switch (type) {
            case 'initial':
                this.setData({
                    initialTimeIndex: index,
                    initialTime: this.data.timeOptions[index] // 更新显示的时间
                });
                break;
            case 'sprint':
                this.setData({
                    sprintTimeIndex: index,
                    sprintTime: this.data.timeOptions[index] // 更新显示的时间
                });
                break;
            case 'distance':
                this.setData({
                    distanceIndex: index,
                    distance: this.data.distanceOptions[index] // 更新显示的距离
                });
                break;
        }
    },
    // 点击提交跳转生成对应的页面
    calculatePace: function () {
        //1. 先取到 初始配束
        const initialTime = common.convertTimeToSeconds(this.data.timeOptions[this.data.initialTimeIndex]);
        //2. 取冲刺配速
        const sprintTime = common.convertTimeToSeconds(this.data.timeOptions[this.data.sprintTimeIndex]);
        //3. 取运动距离
        const distance = this.data.distanceOptions[this.data.distanceIndex];
        //4. 将时间转化为秒
        //5. 将其全部存入数组
        const paceDataObj = {
            initialTime: initialTime,
            sprintTime: sprintTime,
            distance: distance
        };
        //6. 将数组序列化
        let paceDataString = encodeURIComponent(JSON.stringify(paceDataObj));
        //7. 跳转页面
        wx.navigateTo({
            url: '/pages/paceChart/paceChart?paceData=' + paceDataString
        });
    },
});