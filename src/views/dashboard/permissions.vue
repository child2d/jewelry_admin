<template>
  <div class="dashboard-container">
    <div class="header">
      <div>
        <el-row style="width: 300px">
          <!-- <el-col :span="20">
            <span class="header_font">平台</span>
            <el-select
              v-model="filterText"
              style="width:180px;"
              size="small"
              placeholder="请选择"
              clearable
            >
              <el-option label="1" value="1" />
              <el-option label="2" value="2" />
            </el-select>
          </el-col> -->
        </el-row>
      </div>
      <div>
        <el-button type="primary" @click="addRootroute">添加根路由</el-button>
        <el-button v-if="currentType == 'route'" type="success" @click="getAction">动作节点管理</el-button>
        <el-button v-if="currentType == 'action'" type="warning" @click="getMenu">路由节点管理</el-button>
      </div>
    </div>

    <el-tree
      ref="tree"
      style="width:100%"
      :data="treeList"
      show-checkbox
      node-key="id"
      default-expand-all
      :check-strictly="true"
      :expand-on-click-node="false"
      :filter-node-method="filterNode"
    >
      <span slot-scope="{ node, data }" class="custom-tree-node">

        <span>{{ data.name }}</span>
        <span class="right_content">
          <el-button
            v-if="showChildNode(node, data)"
            size="mini"
            @click="() => append(data)"
          >添加子节点</el-button>
          <el-button
            size="mini"
            @click="() => editer(node, data)"
          >编辑</el-button>
          <el-button
            size="mini"
            @click="() => remove(node, data)"
          >删除</el-button>
        </span>

      </span>
    </el-tree>

    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      width="600px"
    >
      <el-form ref="ruleForm" :model="updata" :rules="rules" label-width="120px" class="demo-ruleForm">

        <div v-if="before == true">
          <el-form-item
            label="上级路由名称"
            prop="beforeName"
          >
            <el-input v-model="updata.beforeName" disabled :rules="rules" class="dialog_input" />
          </el-form-item>

          <el-form-item
            label="上级路由地址"
            prop="beforeUrl"
          >
            <el-input v-model="updata.beforeUrl" disabled :rules="rules" class="dialog_input" />
          </el-form-item>
        </div>

        <el-form-item
          label="路由名称"
          prop="name"
        >
          <el-input v-model="updata.name" :rules="rules" class="dialog_input" />
        </el-form-item>
        <el-form-item
          label="路由地址"
          prop="url"
        >
          <el-input v-model="updata.url" class="dialog_input" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import { getMenuList, modifyMenu, deleteMenu, addMenu } from '@/api/menu'
import { getActionList, modifyAction, deleteAction, addAction } from '@/api/action'

export default {
  data() {
    return {
      listLoading: true,
      title: '路由节点编辑',
      // 用户列表
      List: [],
      // 分页
      tableDataLength: null,
      // 当前显示类型
      currentType: 'route',
      // 发送数据
      routeParams: {
        where: {
          pid: '',
          id: ''
        }
      },
      actionParams: {
        where: {
          pid: '',
          id: ''
        }
      },
      before: true,
      ids: [],
      updata: {
        // type : 1 添加， 2 删除， 3 修改
        type: 1,
        pid: '',
        id: '',
        name: '',
        url: ''
      },
      updataBat: '',
      dialogVisible: false,
      filterText: '',

      treeList: [],
      rules: {
        name: [
          { required: true, message: '请输入根路由', trigger: 'blur' }
        ],
        url: [
          { required: true, message: '请输入根路由地址', trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    }
  },
  created() {
    this.updataBat = JSON.parse(JSON.stringify(this.updata))
    this.getMenu()
  },
  methods: {
    // 获取/刷新 菜单列表
    getMenu() {
      this.listLoading = true
      this.currentType = 'route'
      getMenuList(this.routeParams).then(response => {
        this.List = response.list
        this.treeList = this.listToTree(this.List, 'id', 'pid')
        this.listLoading = false
      })
    },
    // 获取/刷新 动作列表
    getAction() {
      this.listLoading = true
      this.currentType = 'action'
      getActionList(this.actionParams).then(response => {
        this.List = response.list
        this.treeList = this.listToTree(this.List, 'id', 'pid')
        this.listLoading = false
      })
    },
    // 发送更改的信息
    updataInfo() {
      // 更改 菜单列表
      if (this.currentType === 'route') {
        // 添加
        if (this.updata.type === 1) {
          addMenu(this.updata).then(response => {
            this.dialogVisible = false
            this.getMenu()
            this.$message(response)
          })
        }
        // 删除
        if (this.updata.type === 2) {
          deleteMenu(this.updata).then(response => {
            this.dialogVisible = false
            this.getMenu()
            this.$message(response)
          })
        }
        // 修改
        if (this.updata.type === 3) {
          modifyMenu(this.updata).then(response => {
            this.dialogVisible = false
            this.getMenu()
            this.$message(response)
          })
        }
      } else { // 更改 动作列表
        if (this.updata.type === 1) {
          addAction(this.updata).then(response => {
            this.dialogVisible = false
            this.getAction()
            this.$message(response)
          })
        }
        // 删除
        if (this.updata.type === 2) {
          deleteAction(this.updata).then(response => {
            this.dialogVisible = false
            this.getAction()
            this.$message(response)
          })
        }
        // 修改
        if (this.updata.type === 3) {
          modifyAction(this.updata).then(response => {
            this.dialogVisible = false
            this.getAction()
            this.$message(response)
          })
        }
      }
    },
    // 表单验证
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.updataInfo()
        } else {
          return false
        }
      })
    },
    // 添加 根路由
    addRootroute() {
      this.updata = JSON.parse(JSON.stringify(this.updataBat))
      this.before = false
      this.updata.type = 1
      this.updata.pid = 0
      this.dialogVisible = true
      this.title = '添加根路由节点'
    },
    // 列表 转 树型结构
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
    // 添加  子节点
    append(data) {
      this.updata = JSON.parse(JSON.stringify(this.updataBat))
      this.before = true
      this.updata.type = 1
      this.updata.beforeName = data.name
      this.updata.beforeUrl = data.url
      this.dialogVisible = true
      this.updata.pid = data.id
      this.title = '添加子节点'
    },

    showChildNode(node, data) {
      if (node.level === 2) {
        return false
      } else {
        return true
      }
    },

    // 编辑信息
    editer(node, data) {
      this.updata = JSON.parse(JSON.stringify(this.updataBat))
      this.before = false
      this.updata.type = 3
      this.updata.id = data.id
      this.updata.name = data.name
      this.updata.url = data.url
      this.dialogVisible = true
    },

    // 删除 节点
    remove(node, data) {
      this.updata = JSON.parse(JSON.stringify(this.updataBat))
      this.$refs.tree.setCheckedKeys([])
      this.$refs.tree.setCheckedKeys([data.id])
      if ('children' in data) {
        if (data.children.length > 0) {
          this.$notify({
            title: '警告',
            message: '系统检测到删除操作中有子节点存在',
            type: 'warning'
          })
          this.$refs.tree.setCheckedKeys([])
          return
        }
      }
      const check = this.$refs.tree.getCheckedKeys()
      this.updata.type = 2
      this.updata.id = check
      this.updataInfo()
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
.display {
  display: flex;
  height: 20px;
}

/* 改变节点高度 */
/deep/ .el-tree-node__content {
  display: flex;
  height: 36px;
  line-height: 36px;
}

.custom-tree-node {
  width: 100%;
  display: flex;
  justify-content: space-between;
}
.right_content {
  width: 300px;
  justify-content: center;
  text-align: center;
  line-height: 36px;
  height: 36px;
}

</style>
