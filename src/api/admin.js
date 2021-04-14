import request from '@/utils/request'
import { autograph } from '@/utils/autograph'

export function getList(query) {
  const url = '/api/admin/infolist'
  const data = autograph(url, query)
  return request({
    url: url,
    method: 'post',
    data
  })
}

export function disable(query) {
  const url = '/api/admin/disable'
  const data = autograph(url, query)
  return request({
    url: url,
    method: 'post',
    data
  })
}

export function enable(query) {
  const url = '/api/admin/enable'
  const data = autograph(url, query)
  return request({
    url: url,
    method: 'post',
    data
  })
}

export function addUser(query) {
  const url = '/api/admin/addUser'
  const data = autograph(url, query)
  return request({
    url: url,
    method: 'post',
    data
  })
}

export function updateUser(query) {
  const url = '/api/admin/updateUser'
  const data = autograph(url, query)
  return request({
    url: url,
    method: 'post',
    data
  })
}
