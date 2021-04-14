const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  guid: state => state.user.guid, // 登录人的guid
  last_time: state => state.user.last_time, // 最后登录时间
  last_ip: state => state.user.last_ip, // 最后登录ip
  roles: state => state.user.roles, // 当前角色
  menu: state => state.user.menu, // 数据库 返回的菜单列表 数据
  actionlist: state => state.user.action, // 数据库 返回的动作列表 数据

  permission_routes: state => state.permission.routes, // 用户菜单数据  （树状结构）
  actions: state => state.permission.actions // 用户动作数据  （树状结构）
}
export default getters
