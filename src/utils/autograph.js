import md5 from 'js-md5'
import store from '../store'

export function autograph(url, query) {
  const version = 1.0 // 当前版本
  const timestamp = Date.parse(new Date()) // 获取客户端当前时间
  const time = timestamp / 1000 // 转换客户端时间
  const param = JSON.stringify(query) // 提交参数
  const token = store.getters.token // 获取用户token
  var guid = 'asdfghjkl456'
  var signatures = ''
  if (token) {
    // 获取用户guid
    guid = store.getters.guid
    // 定义加密hash表
    var hashs = [
      [0, 4, 1, 17, 22, 29],
      [2, 8, 19, 23, 30, 31],
      [4, 12, 31, 1, 5, 10],
      [6, 16, 31, 10, 12, 18],
      [8, 20, 12, 18, 25, 20],
      [10, 24, 17, 27, 1, 22],
      [12, 28, 13, 19, 20, 21],
      [14, 0, 20, 29, 18, 20]
    ]
    // 初始化加密使用token
    var m = ''
    // 获取token里的值
    var str = token.substr(1, 1) + token.substr(4, 1) + token.substr(7, 1)
    // 转为整形
    var index = parseInt(str, 16) % 8
    // 重新组成加密使用的token
    for (var i in hashs[index]) {
      m += token[hashs[index][i]]
    }
    // 加密
    signatures = md5(url + time + guid + param + m)
  } else {
    signatures = md5(url + time + guid + param + 'lvsoso')
  }

  return { version: version, time: time, param: param, signatures: signatures, guid: guid }
}
