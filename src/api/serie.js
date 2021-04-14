import request from '@/utils/request'
import { autograph } from '@/utils/autograph'

/**
 * @Date: 2021-02-07 23:16:43
 * @Desc: 具体系列
 */

export function getList(query) {
  const url = '/api/serie/infolist'
  const data = autograph(url, query)
  return request({
    url: url,
    method: 'post',
    data
  })
}

export function getSerieNameList(query) {
  const url = '/api/seriename/infolist'
  const data = autograph(url, query)
  return request({
    url: url,
    method: 'post',
    data
  })
}

export function getserieDetails(query) {
  const url = '/api/serie/details'
  const data = autograph(url, query)
  return request({
    url: url,
    method: 'post',
    data
  })
}

export function updata(query) {
  const url = '/api/serie/updata'
  const data = autograph(url, query)
  return request({
    url: url,
    method: 'post',
    data
  })
}

export function serieAdd(query) {
  const url = '/api/serie/add'
  const data = autograph(url, query)
  return request({
    url: url,
    method: 'post',
    data
  })
}

