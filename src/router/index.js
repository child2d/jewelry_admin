import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/home/index'),
      meta: { title: '珠宝管理系统', icon: 'dashboard' }
    }]
  }

]

// 异步挂载的路由
// 动态需要根据权限加载的路由表
export const asyncRoutes = [
  {
    path: '/system',
    component: Layout,
    meta: { title: '系统管理', icon: 'table', roles: [] },
    children: [{
      path: 'admin',
      name: 'admin',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '管理员管理', roles: [] }
    }, {
      path: 'role',
      name: 'role',
      component: () => import('@/views/dashboard/role'),
      meta: { title: '角色管理', roles: [] }
    }, {
      path: 'roledistribution',
      name: 'roleDistribution',
      component: () => import('@/views/dashboard/roleDistribution'),
      meta: { title: '角色权限分配', activeMenu: '/system/role', roles: [] },
      hidden: true
    }, {
      path: 'permissions',
      name: 'permissions',
      component: () => import('@/views/dashboard/permissions'),
      meta: { title: '权限列表', roles: [] }
    }]
  },

  {
    path: '/user',
    component: Layout,
    redirect: '/user/index',
    meta: { title: '用户管理', icon: 'user', roles: [] },
    children: [
      {
        path: 'index',
        name: 'user',
        component: () => import('@/views/user/index'),
        meta: { title: '列表', activeMenu: '/user' },
        hidden: true
      }
    ]
  },

  /**
   * 购物车
   */
  {
    path: '/car',
    component: Layout,
    redirect: '/car/index',
    meta: { title: '购物车管理', icon: 'el-icon-shopping-cart-full', roles: [] },
    name: 'Example',
    children: [
      {
        path: 'index',
        name: 'carlist',
        component: () => import('@/views/car/index'),
        meta: { title: '列表', activeMenu: '/car' },
        hidden: true
      },
      {
        path: 'details',
        name: 'carDetails',
        component: () => import('@/views/car/details'),
        meta: { title: '详情', activeMenu: '/car' },
        hidden: true
      }
    ]
  },

  /**
   * 商品 管理
   */
  {
    path: '/commodity',
    component: Layout,
    redirect: '/commodity/item',
    meta: { title: '网站管理', icon: 'form', roles: [] },
    name: 'Example',
    children: [
      {
        path: 'item',
        name: 'serielist',
        component: () => import('@/views/commodity/item'),
        meta: { title: '商品管理' }
      },

      {
        path: 'serie',
        name: 'serielist',
        component: () => import('@/views/commodity/serie'),
        meta: { title: '系列管理' }
      },
      {
        path: 'details',
        name: 'itemDetails',
        component: () => import('@/views/commodity/details'),
        meta: { title: '商品详情', activeMenu: '/commodity/item' },
        hidden: true
      }
    ]
  },

  /**
   *  订单部分
   */
  {
    path: '/order',
    component: Layout,
    redirect: '/order/index',
    meta: { title: '订单管理', icon: 'tree', roles: [] },
    children: [{
      path: 'index',
      name: 'orderlist',
      component: () => import('@/views/order/index'),
      meta: { title: '列表', activeMenu: '/order' },
      hidden: true
    }, {
      path: 'details',
      name: 'orderDetails',
      component: () => import('@/views/order/details'),
      meta: { title: '详情', activeMenu: '/order' },
      hidden: true
    }]
  },

  /**
   *  订单留言 部分
   */
  // {
  //   path: '/message',
  //   component: Layout,
  //   redirect: '/message/index',
  //   meta: { title: '订单留言管理', icon: 'nested', roles: [] },
  //   children: [{
  //     path: 'index',
  //     name: 'messagelist',
  //     component: () => import('@/views/message/index'),
  //     meta: { title: '列表', activeMenu: '/message' },
  //     hidden: true
  //   }]
  // },
  // {
  //   path: '/form',
  //   component: Layout,
  //   redirect: '/form/index',
  //   meta: { title: 'xxx', icon: 'nested', roles: [] },
  //   children: [{
  //     path: 'index',
  //     name: 'form',
  //     component: () => import('@/views/form/index'),
  //     meta: { title: '列表' }
  //     // hidden: true
  //   }, {
  //     path: 'test',
  //     name: 'test',
  //     component: () => import('@/views/form/test'),
  //     meta: { title: 'xx' }
  //     // hidden: true
  //   }]
  // },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
