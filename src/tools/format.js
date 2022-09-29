const FormatNum = num => `${100 + num}`.slice(1)

export function FormatTime(time, format = 'yyyy-MM-dd hh:mm:ss') {
  if (typeof format != 'string' || time == 0 || !time) return '--'

  let time_num = +time

  if (isNaN(time_num)) {
    let temp = new Date(typeof time == 'string' ? time.replace(/-/g, '/') : time)
    if (isNaN(+temp)) {
      time = new Date(time)
      if (isNaN(+time)) return '--'
    } else {
      time = temp
    }
  } else if (time_num > -1) {
    time = new Date(time_num > 10000000000 ? time_num : time_num * 1000)
  } else {
    return '--'
  }

  let t0 = time.getFullYear()
  let t1 = FormatNum(time.getMonth() + 1)
  let t2 = FormatNum(time.getDate())
  let t3 = FormatNum(time.getHours())
  let t4 = FormatNum(time.getMinutes())
  let t5 = FormatNum(time.getSeconds())

  return format.replace(/yyyy/g, t0).replace(/MM/g, t1).replace(/dd/g, t2).replace(/hh/g, t3).replace(/mm/g, t4).replace(/ss/g, t5)
}

const JUDGE = {
  k: 1000,
  w: 10000,
  kw: 10000000
}

export function FormatNumber(num) {
  if (num < 1000) return num

  let result = num, judge

  Object.keys(JUDGE).some(i => {
    let temp = num / JUDGE[i]

    if (temp > 1) {
      result = temp
      judge = i
    } else {
      return true
    }
  })

  return result.toFixed(2) + judge
}
