// 通用的函数
/**
 * 
 * @param {*} item 元素
 * @param {*} array 包含元素的数组
 */
function getIndex(item, array) {
    return array.indexOf(item);
}
/**
 * 
 * @param {*} timeStr 传入时间 格式为 XX:XX:XX 或 XX:XX 或 XX
 */
function convertTimeToSeconds(timeStr) {
    // 首先，通过冒号":"分割字符串
    const parts = timeStr.split(':');
    // 将小时转换为秒（小时数 * 3600）
    const hoursInSec = parseInt(parts[0], 10) * 3600;
    // 将分钟转换为秒（分钟数 * 60）
    const minutesInSec = parseInt(parts[1], 10) * 60;
    // 将小时和分钟的秒数相加得到总秒数
    const totalSeconds = hoursInSec + minutesInSec;
    return totalSeconds;
}

module.exports = {
    getIndex,
    convertTimeToSeconds
}