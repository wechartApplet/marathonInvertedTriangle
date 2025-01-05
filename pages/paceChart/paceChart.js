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
        // 检查这个值是否如预期
    },
    /**
     * 
     * @param {*} totalDistance 
     * @param {*} initialPace 
     * @param {*} sprintPace 
     */
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

        console.log(common.formatTimeHour(Math.round(paceData[0].nearFiveKmTime)));
        this.setData({
            timeDescription: timeDescription,
            totalTime: common.formatTime(Math.ceil(totalTimeSeconds)),// 向上取整
            fastestPace: common.convertTimeFormat(common.formatTime(sprintPace)),
            averagePace: common.convertTimeFormat(this.calculateAveragePace(paceData)),
            paceData: paceData.map(pace => ({
                km: pace.km,
                pace: common.convertTimeFormat(common.formatTime(Math.round(pace.pace))),//四舍五入
                isFast: pace.isFast,
                cumulativeTime: common.formatTimeHour(Math.round(pace.cumulativeTime)),
                nearFiveKmTime: common.formatTimeHour(Math.round(pace.nearFiveKmTime)),
                flexWidthVal: "flex: " + pace.flexWidthVal
            })),
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
        // 计算每公里配速递减的值
        const decreasePerKm = (initialPace - sprintPace) / totalDistance;
        // 初始化每公里配速数组
        let paceData = [];

        // 计算每公里的配速
        let currentPace = initialPace;
        let currentDistance = 0;
        // 初始化累计用时
        let cumulativeTime = 0;
        let flexWidthVal = 0.8;//设定初始宽度

        while (currentDistance < totalDistance) {
            let nextDistance = currentDistance + 1; // 下一个目标公里数
            const paceForThisSegment = currentPace; // 当前段的配速

            // 如果达到或超过总距离，调整配速和距离
            if (nextDistance >= totalDistance) {
                nextDistance = totalDistance;
                console.log("currentDistance: " + currentDistance);
                console.log("nextDistance: " + nextDistance);
                //更新累计用时 右侧为不足一公里用时
                cumulativeTime += currentPace * (nextDistance - currentDistance);
                console.log(decreasePerKm);
            } else {
                cumulativeTime += currentPace;//更新累计用时
            }
            currentPace -= decreasePerKm;// 计算下一段的配速
            flexWidthVal = 0.8 * (currentPace / initialPace);


            // console.log(common.isInteger(nextDistance));
            // console.log(nextDistance + " : " + currentPace + " : " + sprintPace + " : " + decreasePerKm + " : " + (sprintPace - decreasePerKm));
            // console.log(sprintPace);
            // console.log(decreasePerKm);
            // 将当前段的配速和距离添加到数组中
            paceData.push({
                km: nextDistance,
                pace: paceForThisSegment,
                // isFast: currentPace <= sprintPace, // 如果当前配速等于冲刺配速，则为最快
                isFast: common.isInteger(nextDistance) ? sprintPace > currentPace - decreasePerKm : false, // 如果当前配速等于冲刺配速，则为最快
                cumulativeTime: cumulativeTime,
                flexWidthVal: flexWidthVal
            });


            // 如果当前距离大于5公里，计算最近五公里的用时
            if (nextDistance > 5) {
                const nearFiveKmPaces = paceData.slice(-5).map(p => p.pace);
                const nearFiveKmTime = nearFiveKmPaces.reduce((acc, pace) => acc + pace, 0);
                paceData[paceData.length - 1].nearFiveKmTime = nearFiveKmTime;
                console.log("nearFiveKmTime: " + nearFiveKmTime);
            }

            // 更新当前距离
            currentDistance = nextDistance;
        }
        return paceData;
    },

    /**
     * 
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