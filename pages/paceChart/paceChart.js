// 导入公共的函数
const common = require('../../utils/common.js');



Page({

    /**
     * 页面的初始数据
     */
    data: {

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
    calculatePaceData(totalDistance, initialPace, sprintPace) {
        const paceData = this.calculatePace(initialPace, sprintPace, totalDistance);
        console.log(paceData);
        if (!paceData || paceData.length === 0) {
            console.error('Pace data is empty or undefined');
            return; // 退出方法，避免进一步的错误
        }
        // const totalTimeSeconds = paceData[paceData.length - 1].pace;
        const totalTimeSeconds = paceData.reduce((acc, { pace }) => acc + pace, 0);
        const timeDescription = this.determineDistanceType(totalDistance);


        console.log(totalTimeSeconds);
        console.log(this.calculateAveragePace(paceData));
        this.setData({
            timeDescription: timeDescription + '用时',
            totalTime: common.formatTime(Math.ceil(totalTimeSeconds)),// 向上取整
            fastestPace: common.formatTime(sprintPace),
            averagePace: this.calculateAveragePace(paceData),
            paceData: paceData.map(pace => ({
                km: pace.km,
                pace: common.formatTime(pace.pace)
            })),
        });
    },


    calculatePace(initialPace, sprintPace, totalDistance) {
        if (totalDistance <= 0) {
            console.error('Total distance must be greater than 0');
            return []; // 返回一个空数组
        }
        // 计算每公里配速递减的值
        const decreasePerKm = (initialPace - sprintPace) / totalDistance;
        // 初始化每公里配速数组
        let paceData = [];

        // 计算每公里的配速
        let currentPace = initialPace;
        let currentDistance = 0;

        while (currentDistance < totalDistance) {
            let nextDistance = currentDistance + 1; // 下一个目标公里数
            const paceForThisSegment = currentPace; // 当前段的配速

            // 如果达到或超过总距离，调整配速和距离
            if (nextDistance >= totalDistance) {
                nextDistance = totalDistance;
            }
            // 计算下一段的配速
            currentPace -= decreasePerKm;

            // 将当前段的配速和距离添加到数组中
            paceData.push({ km: nextDistance, pace: paceForThisSegment });
            // 更新当前距离
            currentDistance = nextDistance;
        }
        return paceData;
    },

    determineDistanceType(distance) {
        if (distance === 21.0975) return '半马';
        if (distance === 42.195) return '全马';
        if (distance % 10 === 0) return distance + '公里';
        return '自定义距离';
    },
    // 这是一个计算平均配速的方法
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