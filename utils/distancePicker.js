// 生成距离选择值数组
function generateDistanceOptions() {
    const distanceOptions = [];
    for (let i = 1; i < 43; i++) {
        if (i == 1) {
            distanceOptions.push(1.5); // 添加1.5公里的特殊距离
            continue;
        }
        distanceOptions.push(i); // 添加整数公里数

        // 添加特殊马拉松距离
        switch (i) {
            case 21:
                distanceOptions.push(21.0975); // 半程马拉松标准距离
                break;
            case 42:
                distanceOptions.push(42.195); // 全程马拉松标准距离
                break;
        }
    }
    return distanceOptions;
}

module.exports = {
    generateDistanceOptions
};