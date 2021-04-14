import request from '@/utils/request'
import { autograph } from '@/utils/autograph'

export function getList(query) {
  const url = '/api/order/infolist'
  const data = autograph(url, query)
  return request({
    url: url,
    method: 'post',
    data
  })
}

export function getOrderDetails(query) {
  const url = '/api/order/details'
  const data = autograph(url, query)
  return request({
    url: url,
    method: 'post',
    data
  })
}

export function updata(query) {
  const url = '/api/order/updata'
  const data = autograph(url, query)
  return request({
    url: url,
    method: 'post',
    data
  })
}

export function shipment(query) {
  const url = '/api/order/shipment'
  const data = autograph(url, query)
  return request({
    url: url,
    method: 'post',
    data
  })
}

// 退款
export function refund(query) {
  const url = '/api/admin/wxPayRefund'
  const data = autograph(url, query)
  return request({
    url: url,
    method: 'post',
    data
  })
}

