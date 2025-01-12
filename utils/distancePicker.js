// 生成距离选择值
function generateDistanceOptions() {
    const distanceOptions = [];
    for (let i = 1; i < 43; i++) {
        if (i == 1) {
            distanceOptions.push(1.5);
            continue;
        }
        distanceOptions.push(i);
        switch (i) {
            case 21:
                distanceOptions.push(21.0975);// 加上半程马拉松距离
                break;
            case 42:
                distanceOptions.push(42.195); // 加上马拉松距离
                break;
        }
    }
    return distanceOptions;
}

module.exports = {
    generateDistanceOptions
};