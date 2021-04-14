import store from '@/store'
// 权限管理模块
import { asyncRoutes, constantRoutes } from '@/router'
// 用户所有权限 请求
// import { roleAuthority } from '@/api/user'
import { constantButtonPermission } from '@/utils/common'

/**
 * 根据路由meta.role 确定是否当前用户拥有访问权限
 * @roles 用户拥有角色
 * @route 待判定路由
*/

function hasPermission(roles, route) {
  const menu = store.getters.menu
  // 如果当前路由有roles 字段则需要判断用户访问权限
  if (route.meta && route.meta.roles) {
    for (let i = 0; i < menu.length; i++) {
      if (route.meta.title === menu[i].name) {
        return true
      }
    }
  } else {
    return true
  }
}

/**
 * 是否有动作 权限
*/
function hasActionPermission(roles, action) {
  const apiactions = store.getters.actionlist
  for (let i = 0; i < apiactions.length; i++) {
    if (action.path === apiactions[i].url) {
      return true
    }
  }
  return false
}

/**
 * 递归过滤AsyncRoutes路由表
 * @routes 待过滤路由表,首次传入的就是AsyncRoutes
 * @roles 用户拥有角色
 *
*/
export function filterAsyncRoutes(routes, roles) {
  const res = []

  routes.forEach(route => {
    // 复制一份
    const tmp = { ...route }
    // 如果用户有访问权限则加入结果路由表
    if (hasPermission(roles, tmp)) {
      // 如果存在子路由则递归过滤之
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })
  return res
}

/**
 * 递归过滤 Actions 动作表
*/
export function filterAsyncActions(actions, roles) {
  const res = []
  actions.forEach(action => {
    const tmp = { ...action }
    if (hasActionPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncActions(tmp.children, roles)
      }
      res.push(tmp)
    }
  })
  return res
}

const state = {
  routes: [], // 完整路由表
  addRoutes: [], // 用户可访问路由表
  actions: [] //

}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    // 完整的路由表
    state.routes = constantRoutes.concat(routes)
  },
  SET_ACTIONS: (state, actions) => {
    state.actions = actions
  }

}

const actions = {
  generateRoutes({ commit }, roles) {
    return new Promise(resolve => {
      let accessedRoutes, accessedAction
      // 用户是管理员则拥有完整访问权限
      const roles = store.state.user.roles
      if (roles.includes('admin')) {
        accessedRoutes = asyncRoutes || []
        accessedAction = constantButtonPermission
      } else {
        //  否则需要根据用户角色做过滤处理
        accessedRoutes = filterAsyncRoutes(asyncRoutes, '')
        accessedAction = filterAsyncActions(constantButtonPermission, '')
      }
      commit('SET_ROUTES', accessedRoutes)
      commit('SET_ACTIONS', accessedAction)
      resolve(accessedRoutes)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
