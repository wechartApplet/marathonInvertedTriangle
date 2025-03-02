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
    // 验证输入参数的有效性
    if (!timeStr || typeof timeStr !== 'string') {
        throw new Error('Invalid input: timeStr must be a non-empty string');
    }

    const parts = timeStr.split(':');
    // 处理分:秒格式
    if (parts.length === 2) {
        const minutes = parseInt(parts[0], 10);
        const seconds = parseInt(parts[1], 10);
        return minutes * 60 + seconds;
    }
    // 处理时:分:秒格式
    else if (parts.length === 3) {
        const hours = parseInt(parts[0], 10);
        const minutes = parseInt(parts[1], 10);
        const seconds = parseInt(parts[2], 10);
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

    // 根据时长选择不同的显示格式
    if (hours > 0) {
        // 显示为 HH:MM:SS 格式
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    } else if (minutes > 0) {
        // 显示为 MM:SS 格式
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
 * 将任意时间格式转换成 MM'SS'' 格式显示
 * @param {string} timeStr 输入的时间字符串
 * @returns {string} 格式化后的时间字符串
 */
function convertTimeFormat(timeStr) {
    if (!timeStr || typeof timeStr !== 'string') {
        console.error('Invalid input:', timeStr);
        return '00\' 00\'\'';
    }

    // 移除所有空格
    timeStr = timeStr.trim();

    // 处理只有秒的情况
    if (!timeStr.includes(':')) {
        const seconds = parseInt(timeStr, 10);
        if (isNaN(seconds)) {
            console.error('Invalid seconds:', timeStr);
            return '00\' 00\'\'';
        }
        return `00' ${seconds.toString().padStart(2, '0')}''`;
    }

    // 分割时间字符串
    const parts = timeStr.split(':');

    // 处理 HH:MM:SS 格式
    if (parts.length === 3) {
        const minutes = parseInt(parts[1], 10);
        const seconds = parseInt(parts[2], 10);
        if (isNaN(minutes) || isNaN(seconds)) {
            console.error('Invalid HH:MM:SS format:', timeStr);
            return '00\' 00\'\'';
        }
        return `${minutes.toString().padStart(2, '0')}' ${seconds.toString().padStart(2, '0')}''`;
    }

    // 处理 MM:SS 格式
    if (parts.length === 2) {
        const minutes = parseInt(parts[0], 10);
        const seconds = parseInt(parts[1], 10);
        if (isNaN(minutes) || isNaN(seconds)) {
            console.error('Invalid MM:SS format:', timeStr);
            return '00\' 00\'\'';
        }
        return `${minutes.toString().padStart(2, '0')}' ${seconds.toString().padStart(2, '0')}''`;
    }

    console.error('Unsupported time format:', timeStr);
    return '00\' 00\'\'';
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