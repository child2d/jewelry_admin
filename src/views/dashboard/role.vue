<template>
  <div class="dashboard-container">
    <div class="header">

      <div>
        <el-button
          v-permission="'/role/add'"
          type="primary"
          @click="addNewRoleButtom"
        >新增角色</el-button>
      </div>
    </div>

    <div class="list">
      <el-table
        v-loading="listLoading"
        :data="roleList"
        element-loading-text="Loading"
        :header-cell-style="{background:'#eef1f6',color:'#606266'}"
        border
      >
        <el-table-column align="center" label="序号" width="60">
          <template slot-scope="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="角色名称" width="500">
          <template slot-scope="scope">
            <div class="user">
              {{ scope.row.name }}
            </div>
          </template>
        </el-table-column>

        <el-table-column align="center" label="状态">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status == 1" type="success">启用</el-tag>
            <el-tag v-if="scope.row.status == 2" type="danger">禁用</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" label="添加时间">
          <template slot-scope="scope">
            {{ timestampToTime(scope.row.add_time) }}
          </template>
        </el-table-column>

        <el-table-column align="center" label="操作" width="360">
          <template slot-scope="scope">
            <el-button
              v-permission="'/role/modify'"
              :disabled="scope.row.name == 'admin' ? true : false"
              type="warning"
              @click="editor(scope.row)"
            >修改</el-button>
            <el-button
              v-if="scope.row.status == 2"
              v-permission="'/role/enable'"
              type="success"
              @click="enable(scope.row.guid)"
            >启用</el-button>
            <el-button
              v-if="scope.row.status == 1"
              v-permission="'/role/disable'"
              :disabled="scope.row.name == 'admin' ? true : false"
              type="info"
              @click="disable(scope.row.guid)"
            >禁用</el-button>
            <el-button
              v-permission="'/role/permission'"
              :disabled="scope.row.name == 'admin' ? true : false"
              type="warning"
              @click="distribution(scope.row)"
            >分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 分页 -->
    <div class="thepages">
      <div class="block">
        <el-pagination
          :current-page="params.page"
          :page-sizes="[10, 20, 50]"
          :page-size="params.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="tableDataLength"
          @size-change="pageSizeChange"
          @current-change="pageCurrentChange"
        />
      </div>
    </div>

    <!-- 新增/编辑 窗口 -->
    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      width="600px"
    >
      <el-form ref="ruleForm" :model="ruleForm" label-width="80px" :rules="rules" class="demo-ruleForm">

        <el-form-item
          label="角色名称"
          prop="name"
        >
          <el-input v-model="ruleForm.name" class="dialog_input" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配权限 窗口 -->
    <el-dialog
      :title="title"
      :visible.sync="authorityDialogVisible"
      width="600px"
    >
      <el-form ref="authorityRuleForm" :model="authorityRuleForm" label-width="80px" :rules="rules" class="demo-ruleForm">

        <el-form-item
          label="权限名称"
          prop="name"
        >
          <el-input v-model="authorityRuleForm.name" class="dialog_input" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="authorityDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('authorityRuleForm')">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import { getRoleList, disable, enable, addRole, updata } from '@/api/role'
import { timestampToTime } from '@/utils/time'

export default {
  filters: {
    userphone: function(val) {
      if (val === '') {
        return '—————'
      }
      return val
    }
  },
  data() {
    return {
      title: '',
      listLoading: true,
      // 用户列表
      roleList: [],
      // 分页
      tableDataLength: null,
      params: {
        page: 1,
        pagesize: 10
      },
      // 新增/编辑 窗口
      dialogVisible: false,
      // 权限窗口
      authorityDialogVisible: false,
      // 角色表单
      ruleForm: {
        guid: '',
        name: ''
      },
      ruleFormBat: '',
      //  权限表单
      authorityRuleForm: {
        guid: '',
        name: ''
      },
      rules: {
        name: [
          { required: true, message: '角色名称', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.ruleFormBat = JSON.parse(JSON.stringify(this.ruleForm))
    this.fetchList()
  },
  methods: {
    fetchList() {
      this.listLoading = true
      getRoleList(this.params).then(response => {
        this.roleList = response.list
        this.tableDataLength = response.count
        this.listLoading = false
      })
    },
    // 发送新增角色请求
    addNewRole() {
      addRole(this.ruleForm).then(response => {
        this.$message({
          type: 'info',
          message: response
        })
        this.fetchList()
      })
    },
    // 修改信息
    updataRole() {
      updata(this.ruleForm).then(response => {
        this.$message({
          type: 'info',
          message: response
        })
        this.fetchList()
      })
    },
    editor(row) {
      this.ruleForm.guid = row.guid
      this.ruleForm.name = row.name
      this.dialogVisible = true
      this.title = '编辑角色'
    },
    distribution(row) {
      const questionInfo = this.$router.resolve({
        path: '/system/roledistribution',
        query: {
          guid: row.guid,
          name: row.name
        }
      })
      window.open(questionInfo.href, '_blank')
    },
    //  分页
    pageSizeChange(val) {
      this.params.pagesize = val
      this.fetchList()
    },
    pageCurrentChange(val) {
      this.params.page = val
      this.fetchList()
    },
    // 10位时间戳转换
    timestampToTime(timestamp) {
      return timestampToTime(timestamp)
    },
    // 禁用
    disable(guid) {
      disable({ guid: guid }).then(response => {
        this.fetchList()
      })
    },
    // 启用
    enable(guid) {
      enable({ guid: guid }).then(response => {
        this.fetchList()
      })
    },
    // 表单验证
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.dialogVisible = false
          if (this.title === '编辑角色') {
            this.updataRole()
          }
          if (this.title === '新建角色') {
            this.addNewRole()
          }
        } else {
          return false
        }
      })
    },
    addNewRoleButtom() {
      this.dialogVisible = true
      this.ruleForm = JSON.parse(JSON.stringify(this.ruleFormBat))
      this.title = '新建角色'
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

</style>
