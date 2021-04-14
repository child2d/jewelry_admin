import request from '@/utils/request'
import { autograph } from '@/utils/autograph'

export function getActionList(query) {
  const url = '/api/action/infolist'
  const data = autograph(url, query)
  return request({
    url: url,
    method: 'post',
    data
  })
}

export function addAction(query) {
  const url = '/api/action/add'
  const data = autograph(url, query)
  return request({
    url: url,
    method: 'post',
    data
  })
}

export function modifyAction(query) {
  const url = '/api/action/modify'
  const data = autograph(url, query)
  return request({
    url: url,
    method: 'post',
    data
  })
}

export function deleteAction(query) {
  const url = '/api/action/delete'
  const data = autograph(url, query)
  return request({
    url: url,
    method: 'post',
    data
  })
}
