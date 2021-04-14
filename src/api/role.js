import request from '@/utils/request'
import { autograph } from '@/utils/autograph'

export function getRoleList(query) {
  const url = '/api/role/infolist'
  const data = autograph(url, query)
  return request({
    url: url,
    method: 'post',
    data
  })
}

export function disable(query) {
  const url = '/api/role/disable'
  const data = autograph(url, query)
  return request({
    url: url,
    method: 'post',
    data
  })
}

export function enable(query) {
  const url = '/api/role/enable'
  const data = autograph(url, query)
  return request({
    url: url,
    method: 'post',
    data
  })
}

export function addRole(query) {
  const url = '/api/role/addrole'
  const data = autograph(url, query)
  return request({
    url: url,
    method: 'post',
    data
  })
}

export function updata(query) {
  const url = '/api/role/updata'
  const data = autograph(url, query)
  return request({
    url: url,
    method: 'post',
    data
  })
}

// 角色 所拥有 权限列表

export function getRoleAuthority(query) {
  const url = '/api/roleauthority/infolist'
  const data = autograph(url, query)
  return request({
    url: url,
    method: 'post',
    data
  })
}

//  更改 角色-菜单 权限

export function updataRoleMenu(query) {
  const url = '/api/rolemenu/updata'
  const data = autograph(url, query)
  return request({
    url: url,
    method: 'post',
    data
  })
}

//  更改 角色-动作 权限

export function updataRoleAction(query) {
  const url = '/api/roleaction/updata'
  const data = autograph(url, query)
  return request({
    url: url,
    method: 'post',
    data
  })
}
