/**
 * 页面样式相关常量
 */
const STYLE_CONSTANTS = {
    FLEX_WIDTH: {
        DEFAULT: 0.6,
        MIN: 0.5,
        MAX: 0.9,
        STEP: 0.4
    }
};

/**
 * 默认配速和距离值
 */
const DEFAULT_VALUES = {
    INITIAL_PACE: '06:30',
    SPRINT_PACE: '04:30',
    HALF_MARATHON: 21.0975
};

/**
 * 缓存相关常量
 */
const CACHE_KEYS = {
    PACE_CALCULATIONS: 'paceCalculations'
};

module.exports = {
    STYLE_CONSTANTS,
    DEFAULT_VALUES,
    CACHE_KEYS
};
