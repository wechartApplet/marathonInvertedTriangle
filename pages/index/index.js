// 用户没有上传头像时的占位图
const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0';

// 导入时间的数值
const timePicker = require('../../utils/timePicker.js');
// 导入距离的数值
const distancePicker = require('../../utils/distancePicker.js');
// 导入公共的函数
const common = require('../../utils/common.js');
// 导入分享的函数
const share = require('../../utils/share.js');

Page({
    data: {
        timeOptions: [], // 示例时间选项
        distanceOptions: [], // 示例距离选项
        pickerItems: [
            {
                label: '初始配速(几分几秒每公里):',
                options: [],
                selectedIndex: 0,
                type: 'initial'
            },
            {
                label: '冲刺配速 (几分几秒每公里):',
                options: [],
                selectedIndex: 0,
                type: 'sprint'
            },
            {
                label: '计划运动距离(以km为单位):',
                options: [],
                selectedIndex: 0,
                type: 'distance'
            }
        ],
        submitButtonLabel: '提交'
    },
    onLoad: function () {
        // 分享到好友和朋友圈
        wx.showShareMenu({
            withShareTicket: true,
            menus: ['shareAppMessage', 'shareTimeline']
        });
        // 加载时将生成的时间值和距离值进行对应的赋值
        const timeOptions = timePicker.generateTimeList();
        const distanceOptions = distancePicker.generateDistanceOptions();
        const pickerItems = this.data.pickerItems.map(item => {
            if (item.type === 'initial' || item.type === 'sprint') {
                return { ...item, options: timeOptions };//迭代item元素并将timeOptions里的元素值命名为options重新赋值给item
            } else if (item.type === 'distance') {
                return { ...item, options: distanceOptions };
            }
            return item;
        });

        this.setData({
            timeOptions,
            distanceOptions,
            pickerItems
        });

        this.setDefaultIndices();
    },

    // 设置默认的初始配速 和 冲刺配速 和 运动距离
    setDefaultIndices: function () {
        const initialIndex = common.getIndex('06:30', this.data.timeOptions);
        const sprintIndex = common.getIndex('04:30', this.data.timeOptions);
        const distanceIndex = common.getIndex(21.0975, this.data.distanceOptions);

        const pickerItems = this.data.pickerItems.map(item => {
            if (item.type === 'initial') {
                return { ...item, selectedIndex: initialIndex !== -1 ? initialIndex : 0 };
            } else if (item.type === 'sprint') {
                return { ...item, selectedIndex: sprintIndex !== -1 ? sprintIndex : 0 };
            } else if (item.type === 'distance') {
                return { ...item, selectedIndex: distanceIndex !== -1 ? distanceIndex : 0 };
            }
            return item;
        });

        this.setData({ pickerItems });
    },

    // 当用户选择及时更新页面
    bindPickerChange: function (e) {
        const { type, value } = e.detail;
        const pickerItems = this.data.pickerItems.map(item => {
            if (item.type === type) {
                return { ...item, selectedIndex: value };
            }
            return item;
        });

        this.setData({ pickerItems });
    },

    // 点击提交跳转生成对应的页面
    calculatePace: function () {
        const pickerItems = this.data.pickerItems;
        const initialTimeIndex = pickerItems.find(item => item.type === 'initial').selectedIndex;
        const sprintTimeIndex = pickerItems.find(item => item.type === 'sprint').selectedIndex;
        const distanceIndex = pickerItems.find(item => item.type === 'distance').selectedIndex;

        // 1. 先取到 初始配速
        const initialTime = common.convertTimeToSeconds(this.data.timeOptions[initialTimeIndex]);
        // 2. 取冲刺配速
        const sprintTime = common.convertTimeToSeconds(this.data.timeOptions[sprintTimeIndex]);
        // 3. 取运动距离
        const distance = this.data.distanceOptions[distanceIndex];

        // 4. 将时间转化为秒
        // 5. 将其全部存入数组
        const paceDataObj = {
            initialTime: initialTime,
            sprintTime: sprintTime,
            distance: distance
        };

        // 6. 将数组序列化
        let paceDataString = encodeURIComponent(JSON.stringify(paceDataObj));

        // 7. 跳转页面
        wx.navigateTo({
            url: '/pages/paceChart/paceChart?paceData=' + paceDataString
        });
    },
    // 分享到好友
    onShareAppMessage() {
        return share.getShareAppMessage();
    },
    // 分享到朋友圈
    onShareTimeline() {
        return share.getShareTimeline();
    }
});