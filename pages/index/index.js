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
const { DEFAULT_VALUES } = require('../../utils/constants.js');

Page({
    data: {
        timeOptions: [], // 配速时间选项数组
        distanceOptions: [], // 距离选项数组
        pickerItems: [
            {
                label: '初始配速(几分几秒每公里):',
                options: [], // 存储初始配速的可选值
                selectedIndex: 0, // 当前选中的初始配速索引
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
        submitButtonLabel: '提交',
        isSubmitDisabled: false
    },
    onLoad: function () {
        console.log('index onLoad');
        // 开启分享功能
        wx.showShareMenu({
            withShareTicket: true,
            menus: ['shareAppMessage', 'shareTimeline']
        });

        this.initializePickerData();
    },
    onShow: function() {
        console.log('index onShow');
    },
    onHide: function() {
        console.log('index onHide');
    },
    onUnload: function() {
        console.log('index onUnload');
    },
    /**
     * 初始化选择器数据
     */
    initializePickerData: function () {
        const timeOptions = timePicker.generateTimeList();
        const distanceOptions = distancePicker.generateDistanceOptions();

        const pickerItems = this.data.pickerItems.map(item => {
            if (item.type === 'initial' || item.type === 'sprint') {
                return { ...item, options: timeOptions };
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

    /**
     * 设置默认的选择器索引
     */
    setDefaultIndices: function () {
        const initialIndex = common.getIndex(DEFAULT_VALUES.INITIAL_PACE, this.data.timeOptions);
        const sprintIndex = common.getIndex(DEFAULT_VALUES.SPRINT_PACE, this.data.timeOptions);
        const distanceIndex = common.getIndex(DEFAULT_VALUES.HALF_MARATHON, this.data.distanceOptions);

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

    /**
     * 处理选择器值变化
     */
    bindPickerChange: function (e) {
        const { type, value } = e.detail;
        const pickerItems = this.data.pickerItems.map(item => {
            if (item.type === type) {
                return { ...item, selectedIndex: value };
            }
            return item;
        });

        this.setData({ pickerItems });
        this.validateInputs();
    },

    /**
     * 验证输入值
     * @returns {boolean} 是否验证通过
     */
    validateInputs: function () {
        this.setData({ isSubmitDisabled: false });
        return true;
    },

    /**
     * 计算配速并跳转
     */
    calculatePace: function () {
        if (!this.validateInputs()) {
            return;
        }

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
        // 6. 跳转页面
        try {
            const paceDataString = encodeURIComponent(JSON.stringify(paceDataObj));
            wx.navigateTo({
                url: '/pages/paceChart/paceChart?paceData=' + paceDataString,
                fail: (error) => {
                    console.error('页面跳转失败:', error);
                    wx.showToast({
                        title: '页面跳转失败，请重试',
                        icon: 'none',
                        duration: 2000
                    });
                }
            });
        } catch (error) {
            console.error('数据处理失败:', error);
            wx.showToast({
                title: '数据处理失败，请重试',
                icon: 'none',
                duration: 2000
            });
        }
    },

    /**
     * 分享到朋友圈
     */
    onShareTimeline() {
        return share.getShareTimeline();
    }
});