import request from '@/utils/request'
import { autograph } from '@/utils/autograph'

export function getList(query) {
  const url = '/api/car/infolist'
  const data = autograph(url, query)
  return request({
    url: url,
    method: 'post',
    data
  })
}

export function getcarDetails(query) {
  const url = '/api/car/details'
  const data = autograph(url, query)
  return request({
    url: url,
    method: 'post',
    data
  })
}

export function updata(query) {
  const url = '/api/car/updata'
  const data = autograph(url, query)
  return request({
    url: url,
    method: 'post',
    data
  })
}
