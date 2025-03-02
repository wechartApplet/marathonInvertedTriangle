/**
 * 分享配置
 * 包含标题、路径、图片等信息
 */
const shareConfig = {
    title: '马拉松倒三角配速计划生成器',
    path: '/pages/index/index',
    imageUrl: '/Images/index.png'
};

/**
 * 获取分享给好友的配置
 * @returns {Object} 分享配置
 */
function getShareAppMessage() {
    return shareConfig;
}

/**
 * 获取分享到朋友圈的配置
 * @returns {Object} 分享配置
 */
function getShareTimeline() {
    return shareConfig;
}

module.exports = {
    getShareAppMessage,
    getShareTimeline
};