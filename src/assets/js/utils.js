import timeago from 'timeago.js'
/**
 * 返回传入时间距离现在的人性化时间提示
 * @method timeAgo
 * @param  {String} date 时间字符串
 * @return {String}      时间提示
 */
function timeAgo (date) {
  let timeAgo = timeago()
  return timeAgo.format(date, 'zh_CN')
}

// 需加自己解析出特定格式的时间
function resolveDate (date) {

}

/**
 * 格式化时间
 * @method formatDate
 * @param  {String}   date      时间字符串
 * @param  {Boolean}  humanity  是否返回人性化提示
 * @return {String}             格式化后的展示
 */
export function formatDate (date, humanity) {
  if (humanity) {
    return timeAgo(date)
  } else {
    resolveDate(date)
  }
}

/**
 * 节流函数
 * @method throttle
 * @param  {Function} fn      待执行的函数
 * @param  {Number}   delay   延时
 * @param  {Number}   atleast 最小执行间隔
 * @return {[type]}           [description]
 */
export function throttle (fn, delay, atleast) {
  let timer = null
  let startTime = new Date()

  return function () {
    let context = this
    let args = arguments
    let curTime = new Date()

    clearTimeout(timer)
    if (curTime - startTime >= atleast) {
      fn.apply(context, args)   // apply 指定函数指向的 上下文(this) 和 参数列表
      startTime = curTime
    } else {
      timer = setTimeout(function () {
        fn.apply(context, args)
        startTime = curTime
      }, delay)
    }
  }
}