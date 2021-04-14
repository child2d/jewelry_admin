import request from '@/utils/request'
import { autograph } from '@/utils/autograph'

/**
 * @Date: 2021-02-07 23:16:43
 * @Desc: 具体商品
 */

export function getList(query) {
  const url = '/api/item/infolist'
  const data = autograph(url, query)
  return request({
    url: url,
    method: 'post',
    data
  })
}

export function getitemDetails(query) {
  const url = '/api/item/details'
  const data = autograph(url, query)
  return request({
    url: url,
    method: 'post',
    data
  })
}

export function updata(query) {
  const url = '/api/item/updata'
  const data = autograph(url, query)
  return request({
    url: url,
    method: 'post',
    data
  })
}

export function goodsAdd(query) {
  const url = '/api/item/add'
  const data = autograph(url, query)
  return request({
    url: url,
    method: 'post',
    data
  })
}

export function getComment(query) {
  const url = '/api/item/comment'
  const data = autograph(url, query)
  return request({
    url: url,
    method: 'post',
    data
  })
}

export function rollImgDelete(query) {
  const url = '/api/item/rollimg/delete'
  const data = autograph(url, query)
  return request({
    url: url,
    method: 'post',
    data
  })
}

export function rollImgAdd(query) {
  const url = '/api/item/rollimg/add'
  const data = autograph(url, query)
  return request({
    url: url,
    method: 'post',
    data
  })
}

