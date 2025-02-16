
const shareConfig = {
    title: '马拉松倒三角配速计划生成器',
    path: '/pages/index/index',
    imageUrl: '/images/index.png'
};

function getShareAppMessage() {
    return shareConfig;
}

function getShareTimeline() {
    return shareConfig;
}

module.exports = {
    getShareAppMessage,
    getShareTimeline
};