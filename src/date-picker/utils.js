// 判断是否为日期
export const isDate = function (date) {
  if (date instanceof Date) return true
  else return false;
};


// 时间字符串转`22:32` 或者 时间 new Date 换成对象 {'hours':22,'minutes':32} || null
export const parseTime = function (time) {
  if (!time) return null;
  if (time instanceof Date) {
    const _time = new Date(time)
    let hours = _time.getHours()
    let minutes = _time.getMinutes()
    let seconds = _time.getSeconds()
    return { hours, minutes, seconds };
  }

  const values = ('' || time).split(':');
  if (values.length >= 2) {
    const hours = parseInt(values[0], 10);
    const minutes = parseInt(values[1], 10);
    const seconds = parseInt(values[2], 10);
    return { hours, minutes, seconds };
  }
};
