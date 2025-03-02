// 导入公共的函数
const common = require('../../utils/common.js');
// 导入分享的函数
const share = require('../../utils/share.js');
// 导入缓存管理工具
const cacheManager = require('../../utils/cache.js');
// 导入样式处理工具
const styleHelper = require('../../utils/styleHelper.js');

/**
 * 配速图表页面
 * 展示马拉松配速的详细计划，包括每公里配速、累计用时等信息
 */
Page({
    /**
     * 页面的初始数据
     */
    data: {
        infoColumns: [], // 头部展示区域的数据，包括总用时、最快配速等
        paceRowHeaders: [], // 表格的头部内容，包括"公里"和"配速"列
    },

    /**
     * 生命周期函数--监听页面加载
     * @param {Object} options 页面参数，包含encoded的配速数据
     */
    onLoad(options) {
        console.log('paceChart onLoad');
        // 开启分享功能
        wx.showShareMenu({
            withShareTicket: true,
            menus: ['shareAppMessage', 'shareTimeline']
        });

        // 解析从上一个页面传递过来的参数
        const optionsData = JSON.parse(decodeURIComponent(options.paceData));
        const totalDistanceKm = parseFloat(optionsData.distance);
        const initialPaceSeconds = parseInt(optionsData.initialTime, 10);
        const sprintPaceSeconds = parseInt(optionsData.sprintTime, 10);

        // 根据参数计算配速数据
        this.calculatePaceData(totalDistanceKm, initialPaceSeconds, sprintPaceSeconds);
    },

    onShow() {
        console.log('paceChart onShow');
    },

    onHide() {
        console.log('paceChart onHide');
    },

    onUnload() {
        console.log('paceChart onUnload');
    },

    /**
     * 主要的配速数据计算入口
     * 接收前一个页面传递过来的参数进行计算，并更新页面数据
     * @param {number} totalDistance 总距离（公里）
     * @param {number} initialPace 初始配速（秒）
     * @param {number} sprintPace 冲刺配速（秒）
     */
    calculatePaceData(totalDistance, initialPace, sprintPace) {
        // 尝试从缓存获取计算结果
        const cacheKey = cacheManager.generateKey(initialPace, sprintPace, totalDistance);
        const cachedResult = cacheManager.getPaceCalculation(cacheKey);

        // 如果有缓存结果，直接使用
        if (cachedResult) {
            this.setData(cachedResult);
            return;
        }

        // 计算配速数据
        const paceData = this.calculatePace(initialPace, sprintPace, totalDistance);

        // 验证计算结果
        if (!paceData || paceData.length === 0) {
            wx.showToast({
                title: '配速计算失败',
                icon: 'none',
                duration: 2000
            });
            return;
        }

        // 计算总用时（累加每段配速）
        const totalTimeSeconds = paceData.reduce((acc, { pace }) => acc + pace, 0);
        // 获取距离类型描述（全马/半马）
        const timeDescription = this.determineDistanceType(totalDistance);

        // 准备页面显示数据
        const pageData = {
            // 配速数据转换，添加显示所需的额外信息
            paceData: paceData.map(pace => {
                // 确保配速格式为 MM:SS
                const paceTimeStr = common.formatTime(Math.round(pace.pace));
                // 如果返回的是单个数字，转换为 MM:SS 格式
                const formattedPaceTime = paceTimeStr.includes(':') ? paceTimeStr : `00:${paceTimeStr.padStart(2, '0')}`;

                const formattedPace = {
                    km: pace.km,                    // 当前公里数
                    pace: common.convertTimeFormat(formattedPaceTime),  // 配速
                    currentKmTime: common.formatTimeHour(Math.ceil(pace.currentKmTime)),      // 当前公里用时
                    isFast: pace.isFast,           // 是否为最快配速
                    isFastText: "最快",            // 最快配速标记文本
                    isLessThanOneKm: pace.isLessThanOneKm,  // 是否为不足一公里
                    isLessThanOneKmText: "最后不足一公里用时",
                    cumulativeTime: common.formatTimeHour(Math.round(pace.cumulativeTime)),   // 累计用时
                    cumulativeTimeText: "公里累计用时",
                    nearFiveKmTime: pace.nearFiveKmTime ? common.formatTimeHour(Math.round(pace.nearFiveKmTime)) : '', // 近5公里用时
                    nearFiveKmTimeText: "近5公里用时",
                    flexWidthVal: pace.flexWidthVal // 控制配速块显示宽度的值
                };
                return formattedPace;
            }),
            // 头部信息栏数据
            infoColumns: [
                {
                    toggle: !!timeDescription,  // 是否显示
                    value: common.formatTimeHour(Math.ceil(totalTimeSeconds)),  // 总用时
                    label: `${timeDescription}用时`  // 标签文本
                },
                {
                    toggle: true,
                    // 确保最快配速格式为 MM:SS
                    value: common.convertTimeFormat(common.formatTime(initialPace - sprintPace > 0 ? sprintPace : initialPace).padStart(5, '00:')),  // 最快配速
                    label: '最快配速'
                },
                {
                    toggle: true,
                    // 确保平均配速格式为 MM:SS
                    value: common.convertTimeFormat(this.calculateAveragePace(paceData).padStart(5, '00:')),  // 平均配速
                    label: '平均配速'
                }
            ],
            // 表格头部数据
            paceRowHeaders: [
                {
                    viewClass: "km-column",
                    textClass: "km-label",
                    textVal: "公里"
                },
                {
                    viewClass: "speed-column",
                    textClass: "speed-label",
                    textVal: "配速"
                }
            ]
        };

        // 缓存计算结果供后续使用
        cacheManager.setPaceCalculation(cacheKey, pageData);

        // 更新页面数据
        this.setData(pageData);
    },

    /**
     * 计算每公里配速的递减值
     * @param {number} initialPace 初始配速（秒）
     * @param {number} sprintPace 冲刺配速（秒）
     * @param {number} totalDistance 总距离（公里）
     * @returns {number} 每公里递减值（秒/公里）
     */
    calculateDecreasePerKm(initialPace, sprintPace, totalDistance) {
        return (initialPace - sprintPace) / (totalDistance - 1);
    },

    /**
     * 计算某个距离段的配速数据
     * 包括该段的配速、用时、累计时间等信息
     * @param {number} currentDistance 当前距离点（公里）
     * @param {number} totalDistance 总距离（公里）
     * @param {number} currentPace 当前配速（秒）
     * @param {number} cumulativeTime 累计用时（秒）
     * @param {Array} paceData 已有的配速数据数组
     * @param {number} initialPace 初始配速（秒）
     * @param {number} sprintPace 冲刺配速（秒）
     * @returns {Object} 该距离段的完整配速数据
     */
    calculateSegmentPaceData(currentDistance, totalDistance, currentPace, cumulativeTime, paceData, initialPace, sprintPace) {
        // 计算下一个距离点
        const nextDistance = Math.min(currentDistance + 1, totalDistance);
        // 判断是否为最后一段且不足1公里
        const isLessThanOneKm = nextDistance === totalDistance && (nextDistance - currentDistance) < 1;

        // 计算该段用时
        const segmentDistance = nextDistance - currentDistance;
        const segmentTime = isLessThanOneKm ? currentPace * segmentDistance : currentPace;
        const newCumulativeTime = cumulativeTime + segmentTime;

        // 计算样式宽度
        const decreasePerKm = (initialPace - sprintPace) / (totalDistance - 1);
        const flexWidthVal = styleHelper.calculateFlexWidth(
            decreasePerKm,
            totalDistance,
            currentDistance
        );

        // 计算近5公里用时
        const nearFiveKmTime = this.calculateNearFiveKmTime(segmentTime, paceData, nextDistance);

        // 返回该段的完整数据
        return {
            km: nextDistance,
            pace: currentPace,
            currentKmTime: segmentTime,
            isLessThanOneKm,
            cumulativeTime: newCumulativeTime,
            nearFiveKmTime,
            flexWidthVal
        };
    },

    /**
     * 计算近5公里用时
     * 累加当前段和前4段的用时（如果存在）
     * @param {number} segmentTime 当前段用时（秒）
     * @param {Array} paceData 已有的配速数据数组
     * @param {number} nextDistance 下一个距离点（公里）
     * @returns {number|null} 近5公里用时（秒），如果不足5公里返回null
     */
    calculateNearFiveKmTime(segmentTime, paceData, nextDistance) {
        let nearFiveKmTime = segmentTime;

        if (paceData.length > 0) {
            // 最多往前看4段
            const lookBack = Math.min(4, paceData.length);
            for (let i = paceData.length - lookBack; i < paceData.length; i++) {
                if (paceData[i] && typeof paceData[i].currentKmTime === 'number') {
                    nearFiveKmTime += paceData[i].currentKmTime;
                }
            }
        }

        // 只有达到5公里才返回计算结果
        return nextDistance >= 5 ? nearFiveKmTime : null;
    },

    /**
     * 标记最快配速
     * 遍历所有配速数据，找出并标记最快的一段
     * @param {Array} paceData 配速数据数组
     * @returns {Array} 处理后的配速数据数组
     */
    markFastestPace(paceData) {
        // 找出最快配速的索引（不包括不足1公里的段）
        const minPaceIndex = paceData.reduce((minIndex, current, currentIndex, array) => {
            if (!current.isLessThanOneKm && current.pace < array[minIndex].pace) {
                return currentIndex;
            }
            return minIndex;
        }, 0);

        // 标记最快配速段
        if (!paceData[minPaceIndex].isLessThanOneKm) {
            paceData[minPaceIndex].isFast = true;
        }

        return paceData;
    },

    /**
     * 根据初始配速、冲刺配速、公里数，生成对应的配速数组
     * 主要的配速计算逻辑
     * @param {number} initialPace 初始配速（秒）
     * @param {number} sprintPace 冲刺配速（秒）
     * @param {number} totalDistance 总距离（公里）
     * @returns {Array} 配速数据数组
     */
    calculatePace(initialPace, sprintPace, totalDistance) {
        // 验证输入
        if (totalDistance <= 0) {
            return [];
        }

        const paceData = [];
        let currentPace = initialPace;
        let currentDistance = 0;
        let cumulativeTime = 0;

        // 逐段计算配速数据
        while (currentDistance < totalDistance) {
            // 计算当前段的配速数据
            const segmentData = this.calculateSegmentPaceData(
                currentDistance,
                totalDistance,
                currentPace,
                cumulativeTime,
                paceData,
                initialPace,
                sprintPace
            );

            // 保存数据并更新累计时间
            paceData.push(segmentData);
            cumulativeTime = segmentData.cumulativeTime;

            // 更新配速和距离
            if (segmentData.km < totalDistance) {
                currentPace -= (initialPace - sprintPace) / (totalDistance - 1);
            } else {
                currentPace = sprintPace;
            }
            currentDistance = segmentData.km;
        }

        // 标记最快配速并返回结果
        return this.markFastestPace(paceData);
    },

    /**
     * 计算平均配速
     * @param {Array} paceData 配速数据数组
     * @returns {string} 格式化后的平均配速
     */
    calculateAveragePace(paceData) {
        const totalPace = paceData.reduce((sum, current) => sum + current.pace, 0);
        return Math.round(totalPace / paceData.length).toString();
    },

    /**
     * 根据距离判断是全马还是半马
     * @param {number} distance 距离（公里）
     * @returns {string|boolean} 距离类型描述或false
     */
    determineDistanceType(distance) {
        if (distance === 21.0975) return '半马';
        if (distance === 42.195) return '全马';
        return false;
    },

    /**
     * 分享到朋友圈的配置
     */
    onShareTimeline() {
        return share.getShareTimeline();
    }
});