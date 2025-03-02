const { CACHE_KEYS } = require('./constants');

/**
 * 缓存管理工具
 */
const cacheManager = {
    /**
     * 获取配速计算缓存
     * @param {string} key - 缓存键值
     * @returns {Object|null} 缓存的计算结果
     */
    getPaceCalculation(key) {
        try {
            const cache = wx.getStorageSync(CACHE_KEYS.PACE_CALCULATIONS) || {};
            return cache[key] || null;
        } catch (error) {
            console.error('Failed to get cache:', error);
            return null;
        }
    },

    /**
     * 设置配速计算缓存
     * @param {string} key - 缓存键值
     * @param {Object} value - 要缓存的计算结果
     */
    setPaceCalculation(key, value) {
        try {
            const cache = wx.getStorageSync(CACHE_KEYS.PACE_CALCULATIONS) || {};
            cache[key] = value;
            wx.setStorageSync(CACHE_KEYS.PACE_CALCULATIONS, cache);
        } catch (error) {
            console.error('Failed to set cache:', error);
        }
    },

    /**
     * 生成缓存键
     * @param {number} initialPace - 初始配速（秒）
     * @param {number} sprintPace - 冲刺配速（秒）
     * @param {number} totalDistance - 总距离（公里）
     * @returns {string} 缓存键
     */
    generateKey(initialPace, sprintPace, totalDistance) {
        return `${initialPace}-${sprintPace}-${totalDistance}`;
    }
};

module.exports = cacheManager;
