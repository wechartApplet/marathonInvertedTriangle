const { STYLE_CONSTANTS } = require('./constants');

/**
 * 样式处理工具
 */
const styleHelper = {
    /**
     * 计算配速图形的宽度
     * @param {number} decreasePerKm - 每公里配速变化值
     * @param {number} totalDistance - 总距离
     * @param {number} currentDistance - 当前距离
     * @returns {number} 计算后的宽度值
     */
    calculateFlexWidth(decreasePerKm, totalDistance, currentDistance) {
        const { DEFAULT, MIN, MAX, STEP } = STYLE_CONSTANTS.FLEX_WIDTH;

        if (decreasePerKm === 0) {
            return DEFAULT;
        }

        const stepPerKm = STEP / Math.ceil(totalDistance);

        if (decreasePerKm > 0) { // 由慢变快，倒三角
            return MAX - (stepPerKm * currentDistance);
        } else { // 由快变慢，正三角
            return MIN + (stepPerKm * currentDistance);
        }
    },

    /**
     * 根据距离范围获取不同的样式级别
     * @param {number} distance - 距离值
     * @returns {number} 样式级别 (1-4)
     */
    getDistanceLevel(distance) {
        if (distance <= 10) return 1;
        if (distance <= 20) return 2;
        if (distance <= 30) return 3;
        return 4;
    }
};

module.exports = styleHelper;
