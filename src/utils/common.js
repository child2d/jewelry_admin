
/**
 * 按钮
 * 活动权限
 * 操作相关文件
 */

export const constantButtonPermission = [
  {
    path: '/admin',
    meta: { title: '管理员管理' },
    children: [
      {
        path: '/admin/modify',
        meta: { title: '修改' }
      }, {
        path: '/admin/enable',
        meta: { title: '启用' }
      }, {
        path: '/admin/disable',
        meta: { title: '禁用' }
      }, {
        path: '/admin/distribution',
        meta: { title: '分配角色' }
      }, {
        path: '/admin/add',
        meta: { title: '添加管理员' }
      }
    ]
  },

  {
    path: '/role',
    meta: { title: '角色管理' },
    children: [
      {
        path: '/role/modify',
        meta: { title: '修改' }
      }, {
        path: '/role/enable',
        meta: { title: '启用' }
      }, {
        path: '/role/disable',
        meta: { title: '禁用' }
      }, {
        path: '/role/permission',
        meta: { title: '分配权限' }
      }, {
        path: '/role/add',
        meta: { title: '新增角色' }
      }
    ]
  },

  {
    path: '/car',
    meta: { title: '律师函管理' },
    children: [
      {
        path: '/car/info',
        meta: { title: '详情' }
      }, {
        path: '/car/upload',
        meta: { title: '上传律师函' }
      }, {
        path: '/car/modify',
        meta: { title: '编辑内容' }
      }, {
        path: '/car/mailing',
        meta: { title: '邮寄' }
      }
    ]
  },

  {
    path: '/user',
    meta: { title: '用户管理' },
    children: [
      {
        path: '/user/modify',
        meta: { title: '修改' }
      }, {
        path: '/user/enable',
        name: 'disable',
        meta: { title: '启用' }
      }, {
        path: '/user/disable',
        meta: { title: '禁用' }
      }
    ]
  },

  {
    path: '/order',
    meta: { title: '订单管理' },
    children: [
      {
        path: '/order/info',
        name: 'modify',
        meta: { title: '详情' }
      }, {
        path: '/order/refund',
        name: 'disable',
        meta: { title: '发起退款' }
      }
    ]
  },

  {
    path: '/message',
    meta: { title: '留言管理' },
    children: [
      {
        path: '/message/info',
        name: 'modify',
        meta: { title: '详情' }
      }, {
        path: '/message/reply',
        name: 'disable',
        meta: { title: '回复' }
      }, {
        path: '/message/delete',
        name: 'disable',
        meta: { title: '删除' }
      }
    ]
  }]

export function findActions(actions, value) {
  const res = []
  actions.forEach(action => {
    const tmp = { ...action }
    if (tmp.children) {
      tmp.children = findActions(tmp.children, value)
    }
    res.push(tmp)
  })
  return res
}
