import request from '@/utils/request'
import { autograph } from '@/utils/autograph'

export function login(query) {
  const url = '/api/admin/login'
  const data = autograph(url, query)
  return request({
    url: url,
    method: 'post',
    data
  })
}

export function getInfo(query) {
  const url = '/api/admin/info'
  const data = autograph(url, query)
  return request({
    url: url,
    method: 'post',
    data
  })
}

export function logout(query) {
  const url = '/api/admin/logout'
  const data = autograph(url, query)
  return request({
    url: url,
    method: 'post',
    data
  })
}

export function ossRequest(data) {
  const url = '/api/getsign'
  return request({
    url: url,
    method: 'post',
    data
  })
}

export function sendSms(query) {
  const url = '/api/send/sms'
  const data = autograph(url, query)
  return request({
    url: url,
    method: 'get',
    data
  })
}

// 登录时获取 角色权限
export function roleAuthority(query) {
  const url = '/api/roleauthority/list'
  const data = autograph(url, query)
  return request({
    url: url,
    method: 'post',
    data
  })
}

// 选择 角色
export function selectRole(query) {
  const url = '/api/relrole/select'
  const data = autograph(url, query)
  return request({
    url: url,
    method: 'post',
    data
  })
}
