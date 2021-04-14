import request from '@/utils/request'
import { autograph } from '@/utils/autograph'

export function getMenuList(query) {
  const url = '/api/menu/infolist'
  const data = autograph(url, query)
  return request({
    url: url,
    method: 'post',
    data
  })
}

export function modifyMenu(query) {
  const url = '/api/menu/modify'
  const data = autograph(url, query)
  return request({
    url: url,
    method: 'post',
    data
  })
}

export function addMenu(query) {
  const url = '/api/menu/add'
  const data = autograph(url, query)
  return request({
    url: url,
    method: 'post',
    data
  })
}

export function deleteMenu(query) {
  const url = '/api/menu/delete'
  const data = autograph(url, query)
  return request({
    url: url,
    method: 'post',
    data
  })
}

