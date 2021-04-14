<template>
  <div
    v-loading="listLoading"
    class="dashboard-container"
  >
    <div class="header">
      <div>
        <label>当前角色名 {{ roleName }}</label>
      </div>
    </div>

    <el-button
      style="margin-top:10px;margin-bottom:20px"
      type="warning"
    >路由节点</el-button>

    <el-tree
      ref="tree"
      style="width:100%"
      show-checkbox
      node-key="id"
      default-expand-all
      :check-strictly="true"
      :data="routerList"
      :default-checked-keys="routerCheck"
      :filter-node-method="filterNode"
      @check="checkChange"
    >
      <span slot-scope="{ node, data }" class="custom-tree-node">
        <span class="span_width">{{ data.name }}</span>
      </span>
    </el-tree>

    <el-button
      style="margin-top:20px;margin-bottom:20px"
      type="success"
    >动作节点</el-button>

    <el-tree
      ref="actiontree"
      style="width:100%"
      show-checkbox
      default-expand-all
      node-key="id"
      :check-strictly="true"
      :data="actionList"
      :default-checked-keys="actionCheck"
      :filter-node-method="filterNode"
      @check="actionCheckChange"
    >
      <span slot-scope="{ node, data }" class="custom-tree-node">
        <span class="span_width">{{ data.name }}</span>
      </span>
    </el-tree>

    <el-dialog
      title="路由节点编辑"
      :visible.sync="dialogVisible"
      width="600px"
    >
      <el-form ref="ruleForm" :model="ruleForm" label-width="80px" class="demo-ruleForm">
        <el-form-item
          label="平台名称"
          prop="id"
        >
          <el-select
            v-model="ruleForm.id"
            style="width:180px;"
            size="small"
            placeholder="请选择"
            clearable
          >
            <el-option label="1" value="1" />
            <el-option label="2" value="2" />
          </el-select>
        </el-form-item>
        <el-form-item
          label="路由名称"
          prop="name"
        >
          <el-input v-model="ruleForm.name" class="dialog_input" />
        </el-form-item>
        <el-form-item
          label="路由地址"
          prop="url"
        >
          <el-input v-model="ruleForm.url" class="dialog_input" />
        </el-form-item>

      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <!-- <el-button type="primary" @click="changesConfirm">确 定</el-button> -->
      </span>
    </el-dialog>

  </div>
</template>

<script>
import { getRoleAuthority, updataRoleMenu, updataRoleAction } from '@/api/role'

export default {
  data() {
    return {
      listLoading: true,
      guid: this.$route.query.guid,
      roleName: this.$route.query.name,
      // 用户列表
      List: [],
      // 分页
      tableDataLength: null,
      // 当前显示类型
      currentType: 'route',
      // 发送数据
      params: {
        role_guid: this.$route.query.guid
      },
      addUpdata: {
        type: 'add',
        role_guid: this.$route.query.guid,
        menu_guid: '',
        action_guid: ''
      },
      cutUpdata: {
        type: 'cut',
        role_guid: this.$route.query.guid,
        menu_guid: '',
        action_guid: ''
      },
      dialogVisible: false,
      ruleForm: {
        id: ''
      },
      // 所有菜单 列表
      routerList: [],
      // 所有动作 列表
      actionList: [],
      // 当前管理所拥有的权限 （数据为数组，内含对应权限 数据库的 id 的值）
      routerCheck: [], // 角色拥有的 菜单权限
      actionCheck: [] // 角色拥有的 动作权限
    }
  },
  mounted() {
    this.getAll()
    // this.getRouteArray()
  },
  created() {
  },
  methods: {
    getAll() {
      // 获取/菜单 列表
      getRoleAuthority(this.params).then(response => {
        this.routerList = this.listToTree(response.menulist, 'id', 'pid')
        this.actionList = this.listToTree(response.actionlist, 'id', 'pid')
        this.routerCheck = response.menu
        this.actionCheck = response.action
        this.listLoading = false
      })
    },

    // 发送 菜单 更改的信息
    updataInfo(type) {
      if (type === 'add') {
        updataRoleMenu(this.addUpdata).then(response => {
          this.$message(response)
        })
      }
      if (type === 'cut') {
        updataRoleMenu(this.cutUpdata).then(response => {
          this.$message(response)
        })
      }
    },
    // 发送动作 更改的信息
    updataActionInfo(type) {
      if (type === 'add') {
        updataRoleAction(this.addUpdata).then(response => {
          this.$message(response)
        })
      }
      if (type === 'cut') {
        updataRoleAction(this.cutUpdata).then(response => {
          this.$message(response)
        })
      }
    },

    // 菜单权限 修改
    checkChange(data, node, type) {
      const current_node = this.$refs.tree.getNode(data.id)
      if (current_node.checked === true) {
        const parentNode = this.$refs.tree.getNode(data.pid)
        // 判断 是否有父节点 && 父节点是否已经选择
        if (parentNode !== null && parentNode.checked !== true) {
          this.$refs.tree.setChecked(data.id, false)
          this.$notify({
            title: '警告',
            message: '系统检测到新增操作中父节点未选中',
            type: 'warning'
          })
          return
        }
        this.addUpdata.menu_guid = data.guid
        this.addUpdata.action_guid = ''
        this.updataInfo('add')
        return
      }

      if (current_node.checked === false) {
        // 如果取消选中
        let childNode = ''
        if ('children' in data) {
          for (let j = 0, len = data.children.length; j < len; j++) {
            childNode = this.$refs.tree.getNode(data.children[j].id)
            // 检测子节点
            if (childNode.checked === true) {
              this.$refs.tree.setChecked(data.id, true)
              this.$notify({
                title: '警告',
                message: '系统检测到删除操作中有子节点存在',
                type: 'warning'
              })
              return
            }
          }
        }
        this.cutUpdata.menu_guid = data.guid
        this.addUpdata.action_guid = ''
        this.updataInfo('cut')
        return
      }
    },

    // 动作权限 修改
    actionCheckChange(data, node, type) {
      const current_node = this.$refs.actiontree.getNode(data.id)
      if (current_node.checked === true) {
        const parentNode = this.$refs.actiontree.getNode(data.pid)
        // 判断 是否有父节点 && 父节点是否已经选择
        if (parentNode !== null && parentNode.checked !== true) {
          this.$refs.actiontree.setChecked(data.id, false)
          this.$notify({
            title: '警告',
            message: '系统检测到新增操作中父节点未选中',
            type: 'warning'
          })
          return
        }
        this.addUpdata.menu_guid = ''
        this.addUpdata.action_guid = data.guid
        this.updataActionInfo('add')
        return
      }

      if (current_node.checked === false) {
        // 如果取消选中
        let childNode = ''
        if ('children' in data) {
          for (let j = 0, len = data.children.length; j < len; j++) {
            childNode = this.$refs.actiontree.getNode(data.children[j].id)
            // 检测子节点
            if (childNode.checked === true) {
              this.$refs.actiontree.setChecked(data.id, true)
              this.$notify({
                title: '警告',
                message: '系统检测到删除操作中有子节点存在',
                type: 'warning'
              })
              return
            }
          }
        }
        this.addUpdata.menu_guid = ''
        this.cutUpdata.action_guid = data.guid
        this.updataActionInfo('cut')
        return
      }
    },

    listToTree(dataList, id, pid) {
      const data = JSON.parse(JSON.stringify(dataList))
      const result = []
      if (!Array.isArray(data)) {
        return result
      }
      data.forEach((item) => {
        delete item.children
      })
      const map = {}
      data.forEach(item => {
        map[item[id]] = item
      })
      data.forEach(item => {
        const parent = map[item[pid]]
        if (parent) {
          (parent.children || (parent.children = [])).push(item)
        } else {
          result.push(item)
        }
      })
      return result
    },

    filterNode(value, data) {
      if (!value) return true
      return data.routername.indexOf(value) !== -1
    }

  }
}
</script>

<style scoped>
.dashboard-container {
  margin: 10px 20px 0;
}
.header {
  margin-top: 20px;
  margin-bottom: 10px;
  display: flex;
  width: 100%;
  flex: 1;
  justify-content: space-between;
}
.header_font {
  font-size: 14px;
  text-align: left;
  color: #747774;
  margin-left:10px;
  margin-right:10px;
}

/* 改变节点高度 */
.el-tree-node__content {
  display: flex;
  height: 36px;
  line-height: 36px;
  /* width: 200px; */
}

.custom-tree-node {
  width: 100%;
  display: flex ;
  width: 200px;
  /* justify-content: space-between; */
}
.span_width {
  width: 200px;
  display: flex;
}

/deep/ .el-tree-node__content {
  display: flex;
  height: 36px;
  line-height: 36px;
}

/deep/ .el-tree-node.is-expanded>.el-tree-node__children {
    display: flex ;
}
</style>
