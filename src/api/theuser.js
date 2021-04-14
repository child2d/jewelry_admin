import request from '@/utils/request'
import { autograph } from '@/utils/autograph'

export function getList(query) {
  const url = '/api/user/infolist'
  const data = autograph(url, query)
  return request({
    url: url,
    method: 'post',
    data
  })
}

export function disable(query) {
  const url = '/api/user/disable'
  const data = autograph(url, query)
  return request({
    url: url,
    method: 'post',
    data
  })
}

export function enable(query) {
  const url = '/api/user/enable'
  const data = autograph(url, query)
  return request({
    url: url,
    method: 'post',
    data
  })
}

export function updataUser(query) {
  const url = '/api/user/updata'
  const data = autograph(url, query)
  return request({
    url: url,
    method: 'post',
    data
  })
}

