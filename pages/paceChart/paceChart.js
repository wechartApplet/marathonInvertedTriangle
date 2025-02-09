// 导入公共的函数
const common = require('../../utils/common.js');



Page({

    /**
     * 页面的初始数据
     */
    data: {
        infoColumns: [],// 头部html内容
        paceRowHeaders: [],//表格的头部内容
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        const optionsData = JSON.parse(decodeURIComponent(options.paceData));
        const totalDistanceKm = parseFloat(optionsData.distance);
        const initialPaceSeconds = parseInt(optionsData.initialTime, 10);
        const sprintPaceSeconds = parseInt(optionsData.sprintTime, 10);
        this.calculatePaceData(totalDistanceKm, initialPaceSeconds, sprintPaceSeconds);
    },
    /**
     * 接收前一个页面传递过来的参数进行计算
     * @param {*} totalDistance 
     * @param {*} initialPace 
     * @param {*} sprintPace 
     */
    calculatePaceData(totalDistance, initialPace, sprintPace) {
        //将接收到的前一个页面传递过来的参数传给专门计算的方法
        const paceData = this.calculatePace(initialPace, sprintPace, totalDistance);
        console.log(paceData);
        if (!paceData || paceData.length === 0) {
            console.error('Pace data is empty or undefined');
            return; // 退出方法，避免进一步的错误
        }
        const totalTimeSeconds = paceData.reduce((acc, { pace }) => acc + pace, 0);
        const timeDescription = this.determineDistanceType(totalDistance);
        // 为页面变量赋值
        this.setData({
            paceData: paceData.map(pace => ({
                km: pace.km,
                pace: common.convertTimeFormat(common.formatTime(Math.round(pace.pace))),//四舍五入
                currentKmTime: common.formatTimeHour(Math.ceil(pace.currentKmTime)),
                isFast: pace.isFast,
                isFastText: pace.isFastText,
                isLessThanOneKm: pace.isLessThanOneKm,
                isLessThanOneKmText: pace.isLessThanOneKmText,
                cumulativeTime: common.formatTimeHour(Math.round(pace.cumulativeTime)),
                cumulativeTimeText: pace.cumulativeTimeText,
                nearFiveKmTime: common.formatTimeHour(Math.round(pace.nearFiveKmTime)),
                nearFiveKmTimeText: pace.nearFiveKmTimeText,
                flexWidthVal: pace.flexWidthVal
            })),
            infoColumns: [
                {
                    toggle: !!timeDescription,
                    value: common.formatTime(Math.ceil(totalTimeSeconds)),
                    label: `${timeDescription}用时`
                },
                {
                    toggle: true,
                    value: common.convertTimeFormat(common.formatTime(sprintPace)),
                    label: '最快配速'
                },
                {
                    toggle: true,
                    value: common.convertTimeFormat(this.calculateAveragePace(paceData)),
                    label: '平均配速'
                }
            ],
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
        });
    },

    /**
     * 根据初始配速、冲刺配速、公里数，生成对应的配速数组
     * @param {*} initialPace 
     * @param {*} sprintPace 
     * @param {*} totalDistance 
     */
    calculatePace(initialPace, sprintPace, totalDistance) {
        if (totalDistance <= 0) {
            return []; // 返回一个空数组
        }
        // 计算每公里配速递减或递增的值
        const decreasePerKm = (initialPace - sprintPace) / (totalDistance - 1);
        // 初始化每公里配速数组
        let paceData = [];
        // 当前公里配速
        let currentPace = initialPace;
        // 当前公里数
        let currentDistance = 0;
        // 初始化累计用时
        let cumulativeTime = 0;
        //设定样式初始宽度
        let flexWidthVal = 0.8;
        // 是否不足一公里
        let isLessThanOneKm = false;
        // 是否最快
        let isFast = false;

        while (currentDistance < totalDistance) {
            // 下一个目标公里数
            let nextDistance = currentDistance + 1;
            // 当前段的配速 --- 这个变量有用 别乱改
            const paceForThisSegment = currentPace;

            // 如果达到或超过总距离，调整配速和距离
            if (nextDistance >= totalDistance) {
                currentPace = sprintPace;// 计算下一段的配速
                nextDistance = totalDistance;
                //更新累计用时 右侧为不足一公里用时
                cumulativeTime += currentPace * (nextDistance - currentDistance);
                if (nextDistance - currentDistance < 1) {
                    isLessThanOneKm = true;
                }

            } else {
                cumulativeTime += currentPace;//更新累计用时
                currentPace -= decreasePerKm;// 计算下一段的配速
            }

            // 这里的逻辑应该是 不管它是正还是负都用剩余的宽度做加减计算
            /**
             * 此处应该优化方法，使宽度渲染得更加美丽
             * 1. 如果速度是由慢变快，那么展示图形是 倒三角，则设置初始宽度为 最大，依次 递减 宽度
             * 
             * 2. 如果速度是由快变慢，那么展示图形是 正三角，则设置始始宽度为 最小，依次 递增 宽度
             * 
             * 3. 为保证渲染的图形更加有层次感，建议将 42 公里的数值，分为几个等级，例 0~10，10~20，20~30，30~42
             * 
             * 4. 还需要考虑到 用户给的速度 初始速度与冲刺速度相等的情况
             */
            if (decreasePerKm > 0) {//用户给的速度是由慢变快
                flexWidthVal -= 0.17 / Math.ceil(totalDistance);
            } else {//用户给的速度是由快变慢
                flexWidthVal += 0.17 / Math.ceil(totalDistance);

            }
            // 将当前段的配速和距离添加到数组中
            paceData.push({
                km: nextDistance,
                pace: paceForThisSegment,
                currentKmTime: isLessThanOneKm ?
                    currentPace * (nextDistance - currentDistance) :
                    paceForThisSegment,//当前段距离用时
                isLessThanOneKm: isLessThanOneKm,
                isLessThanOneKmText: "最后不足一公里用时",
                isFast: isFast,
                isFastText: "最快",
                cumulativeTime: cumulativeTime,
                cumulativeTimeText: "公里累计用时",
                flexWidthVal: flexWidthVal
            });


            // 当最后一公里小于1时 找到最快配速并重新更新数据
            if (nextDistance >= totalDistance) {
                const minPaceIndex = paceData.reduce((minIndex, current, currentIndex, array) => {
                    // 只有当 current.isLessThanOneKm 不为 true 时才进行比较
                    if (!current.isLessThanOneKm && current.pace < array[minIndex].pace) {
                        return currentIndex;
                    }
                    return minIndex;
                }, 0);

                // 确保找到的下标对应的元素满足 isLessThanOneKm != true
                if (!paceData[minPaceIndex].isLessThanOneKm) {
                    paceData[minPaceIndex].isFast = true;
                }
            }

            // 如果当前距离大于5公里，计算最近五公里的用时
            if (nextDistance > 5) {
                const nearFiveKmPaces = paceData.slice(-5).map(p => p.pace);
                const nearFiveKmTime = nearFiveKmPaces.reduce((acc, pace) => acc + pace, 0);
                paceData[paceData.length - 1].nearFiveKmTime = nearFiveKmTime;
            }

            // 更新当前距离
            currentDistance = nextDistance;
        }
        return paceData;
    },

    /**
     * 为头部距离赋值
     * @param {*} distance 
     */
    determineDistanceType(distance) {
        if (distance === 21.0975) return '半马';
        if (distance === 42.195) return '全马';
        return false;
    },

    /**
     * 这是一个计算平均配速的方法
     * @param {*} paceData 
     */
    calculateAveragePace(paceData) {
        const totalSeconds = paceData.reduce((acc, { pace }) => acc + pace, 0);
        const averageSeconds = Math.round(totalSeconds / paceData.length);//四舍五入
        return common.formatTime(averageSeconds);
    },




    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    }
})