import request from '@/utils/request'
import { autograph } from '@/utils/autograph'

export function getList(query) {
  const url = '/api/logcar/infolist'
  const data = autograph(url, query)
  return request({
    url: url,
    method: 'post',
    data
  })
}

export function getDetails(query) {
  const url = '/api/logcar/details'
  const data = autograph(url, query)
  return request({
    url: url,
    method: 'post',
    data
  })
}

