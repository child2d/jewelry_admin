import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'
// 用户ID
const guid = 'Admin-guid'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
// user id
export function getGuid() {
  return Cookies.get(guid)
}

export function setGuid(token) {
  return Cookies.set(guid, token)
}

export function removeGuid() {
  return Cookies.remove(guid)
}
