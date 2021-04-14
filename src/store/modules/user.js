import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken, getGuid, setGuid, removeGuid } from '@/utils/auth'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: '',
    guid: getGuid(),
    last_time: '',
    last_ip: '',
    roles: '',
    menu: '',
    action: ''
  }
}

const state = getDefaultState()

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  // 用户ID
  SET_GUID: (state, guid) => {
    state.guid = guid
  },
  // 最后登陆时间
  SET_LAST_TIME: (state, last_time) => {
    state.last_time = last_time
  },
  // 最后登陆ip
  SET_LAST_IP: (state, last_ip) => {
    state.last_ip = last_ip
  },
  // 角色
  SET_ROLE: (state, roles) => {
    state.roles = roles
  },
  // 菜单
  SET_MENU: (state, menu) => {
    state.menu = menu
  },
  // 动作
  SET_ACTION: (state, action) => {
    state.action = action
  }

}

const actions = {
  // user login
  login({ commit }, userInfo) {
    userInfo.username = userInfo.username.trim()
    userInfo.password = userInfo.password.trim()
    userInfo.captcha = userInfo.captcha.trim()
    return new Promise((resolve, reject) => {
      login(userInfo).then(response => {
        setToken(response.token)
        setGuid(response.guid)
        commit('SET_TOKEN', response.token)
        commit('SET_GUID', response.guid)
        resolve()
      }).catch(error => {
        reject(error)
        console.log(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.guid).then(response => {
        if (response) {
          // 真实姓名
          commit('SET_NAME', response.nick_name)
          // 头像
          commit('SET_AVATAR', response.avatar_img)
          // 最后登陆时间
          commit('SET_LAST_TIME', response.last_time)
          // 最后登陆Ip
          commit('SET_LAST_IP', response.last_ip)
          // 角色
          commit('SET_ROLE', response.roles)
          // 菜单权限
          commit('SET_MENU', response.authority.menu)
          // 菜单权限
          commit('SET_ACTION', response.authority.action)

          resolve(response)
        }
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        commit('SET_TOKEN', '')
        commit('SET_GUID', '')
        removeToken()
        removeGuid()
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 前端 登出
  FedLogOut({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_GUID', '')
      removeToken()
      removeGuid()
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

