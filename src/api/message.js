import request from '@/utils/request'
import { autograph } from '@/utils/autograph'

export function getList(query) {
  const url = '/api/message/infolist'
  const data = autograph(url, query)
  return request({
    url: url,
    method: 'post',
    data
  })
}

export function details(query) {
  const url = '/api/message/details'
  const data = autograph(url, query)
  return request({
    url: url,
    method: 'post',
    data
  })
}

export function modify(query) {
  const url = '/api/message/modify'
  const data = autograph(url, query)
  return request({
    url: url,
    method: 'post',
    data
  })
}

export function updataMessage(query) {
  const url = '/api/message/updata'
  const data = autograph(url, query)
  return request({
    url: url,
    method: 'post',
    data
  })
}
