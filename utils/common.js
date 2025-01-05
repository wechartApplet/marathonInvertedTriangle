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
 * 将XX:XX:XX 或 XX:XX 或 XX的时间转换为秒数
 * @param {*} timeStr 传入时间 格式为 XX:XX:XX 或 XX:XX 或 XX
 */
function convertTimeToSeconds(timeStr) {
    // // 首先，通过冒号":"分割字符串
    // const parts = timeStr.split(':');
    // // 将小时转换为秒（小时数 * 3600）
    // const hoursInSec = parseInt(parts[0], 10) * 3600;
    // // 将分钟转换为秒（分钟数 * 60）
    // const minutesInSec = parseInt(parts[1], 10) * 60;
    // // 将小时和分钟的秒数相加得到总秒数
    // const totalSeconds = hoursInSec + minutesInSec;
    // return totalSeconds;

    // 首先，通过冒号":"分割字符串
    const parts = timeStr.split(':');

    // 检查是否有小时部分
    if (parts.length === 2) {
        // 如果只有两部分，假设它们是分钟和秒
        const minutes = parseInt(parts[0], 10);
        const seconds = parseInt(parts[1], 10);
        // 将分钟转换为秒（分钟数 * 60）并加上秒数
        return minutes * 60 + seconds;
    } else if (parts.length === 3) {
        // 如果有三部分，假设它们是小时、分钟和秒
        const hours = parseInt(parts[0], 10);
        const minutes = parseInt(parts[1], 10);
        const seconds = parseInt(parts[2], 10);
        // 将小时转换为秒（小时数 * 3600），加上分钟转换为秒（分钟数 * 60）并加上秒数
        return hours * 3600 + minutes * 60 + seconds;
    } else {
        // 如果格式不正确，抛出错误
        throw new Error('Invalid time format. Please use MM:SS or HH:MM:SS.');
    }

}
/**
 * 将秒转换为XX:XX:XX 或XX:XX或XX格式的时间
 * @param {*} seconds 传入参数为秒
 */
function formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    // 根据小时和分钟的值来决定输出的格式
    if (hours > 0) {
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    } else if (minutes > 0) {
        return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    } else {
        return secs.toString();
    }
}
/**
 * 将秒转换为XX:XX:XX 必须以小时为开头哪怕为0
 * @param {*} seconds 
 */
function formatTimeHour(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}


/**
 * 将hh:mm格式转换成hh'mm''
 * @param {*} timeStr 
 */
function convertTimeFormat(timeStr) {
    // 首先，通过冒号":"分割字符串
    const parts = timeStr.split(':');
    // 检查分割后的数组长度是否为2，即是否为HH:MM格式
    if (parts.length === 2) {
        // 使用模板字符串将小时和分钟转换为HH' MM''格式
        return `${parts[0]}' ${parts[1]}''`;
    } else {
        // 如果格式不正确，抛出错误
        throw new Error('Invalid time format. Please use HH:MM.');
    }
}
/**
 * 判断是否为整数
 * @param {*} num 
 */
function isInteger(num) {
    return Math.floor(num) === num;
}

module.exports = {
    getIndex,
    convertTimeToSeconds,
    formatTime,
    convertTimeFormat,
    formatTimeHour,
    isInteger
}