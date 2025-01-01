// 生成时间选择值
function generateTimeList() {
  const timeList = [];
  let startMinutes = 9, startSeconds = 32;
  let endMinutes = 2, endSeconds = 30;

  for (let totalSeconds = startMinutes * 60 + startSeconds; totalSeconds >= endMinutes * 60 + endSeconds; totalSeconds--) {
      const minutes = totalSeconds / 60 | 0; // 使用整数除法获取分钟数
      const seconds = totalSeconds % 60;
      timeList.push(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
  }
  return timeList;
}
// 找到某一个时间的下标值
function getTimeIndex(timeOptions, time) {
  return timeOptions.indexOf(time);
}

module.exports = {
  generateTimeList,
  getTimeIndex
};