<template>
  <div class="dashboard-container">
    <div class="head_button">
      <el-button
        v-permission="'/admin/add'"
        type="primary"
        @click="clearAddFrom"
      >添加管理人员</el-button>
    </div>
    <div class="dialog_from">
      <!-- 添加用户 -->
      <el-dialog title="添加用户" :visible.sync="addFormVisible">
        <el-form :model="addForm">
          <el-form-item label="用户名">
            <el-input
              v-model="addForm.admin_name"
              autocomplete="off"
            />
          </el-form-item>
          <el-form-item label="密码">
            <el-input
              v-model="addForm.password"
              autocomplete="off"
              type="password"
            />
          </el-form-item>
          <el-form-item label="昵称">
            <el-input v-model="addForm.nick_name" autocomplete="off" />
          </el-form-item>

          <el-form-item label="上传图片">
            <el-upload
              class="avatar-uploader"
              action="#"
              :show-file-list="false"
              :http-request="()=>{return false}"
              :before-upload="beforeAvatarUpload"
            >
              <div
                v-loading="imgLoading"
                :element-loading-text="imgText"
                :element-loading-spinner="imgIcon"
                element-loading-background="rgba(0, 0, 0, 0.8)"
              >
                <img v-if="addImageUrl" :src="addImageUrl" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon" />
              </div>
            </el-upload>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="addFormVisible = false">取 消</el-button>
          <el-button
            type="primary"
            :disabled="buttonType"
            @click="addUser"
          >确 定</el-button>
        </div>
      </el-dialog>

      <!-- 修改用户 -->
      <el-dialog title="修改用户" :visible.sync="updateFormVisible">
        <el-form :model="updateForm">
          <el-form-item label="用户名">
            <el-input
              v-model="updateForm.admin_name"
              autocomplete="off"
              readonly="readonly"
            />
          </el-form-item>
          <el-form-item label="昵称">
            <el-input
              v-model="updateForm.nick_name"
              autocomplete="off"
            />
          </el-form-item>
          <el-form-item label="上传图片">
            <el-upload
              class="avatar-uploader"
              action="#"
              :show-file-list="false"
              :http-request="()=>{return false}"
              :before-upload="beforeAvatarUpload"
            >
              <div
                v-loading="imgLoading"
                :element-loading-text="imgText"
                :element-loading-spinner="imgIcon"
                element-loading-background="rgba(0, 0, 0, 0.8)"
              >
                <img
                  v-if="updateForm.avatar_img"
                  :src="updateForm.avatar_img"
                  class="avatar"
                >
                <i v-else class="el-icon-plus avatar-uploader-icon" />
              </div>
            </el-upload>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="updateFormVisible = false">取 消</el-button>
          <el-button
            type="primary"
            :disabled="buttonType"
            @click="updateUser"
          >确 定</el-button>
        </div>
      </el-dialog>

      <!-- 分配角色 -->
      <el-dialog
        title="分配角色"
        :visible.sync="roleDialog"
        width="600px"
      >
        <el-form ref="roleForm" :model="roleForm" label-width="120px" class="demo-ruleForm">
          <el-form-item
            label="角色名称"
            prop="name"
          >
            <el-select
              v-model="roleForm.role_guid"
              style="width:180px;"
              size="small"
              placeholder="请选择"
              clearable
            >
              <el-option v-for="(item, index) in rolelist" :key="index" :label="item.name" :value="item.guid" />
            </el-select>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="roleDialog = false">取 消</el-button>
          <el-button type="primary" @click="roleSelect">确 定</el-button>
        </span>
      </el-dialog>
    </div>
    <div class="list">
      <el-table
        v-loading="listLoading"
        :data="userList"
        element-loading-text="Loading"
        :header-cell-style="{background:'#eef1f6',color:'#606266'}"
        border
      >
        <el-table-column align="center" label="ID" width="40">
          <template slot-scope="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="用户" width="60">
          <template slot-scope="scope">
            <div class="user">
              <el-avatar :size="40" src @error="errorHandler">
                <img :src="scope.row.avatar_img">
              </el-avatar>
              <div class="admin_name">{{ scope.row.admin_name }}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="昵称">
          <template slot-scope="scope">
            {{ scope.row.nick_name }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="状态">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status == 1" type="success">启用</el-tag>
            <el-tag v-if="scope.row.status == 0" type="danger">禁用</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" label="角色" prop="rolename" />

        <el-table-column align="center" label="注册时间">
          <template slot-scope="scope">
            {{ timestampToTime(scope.row.add_time) }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="上一次登录时间">
          <template slot-scope="scope">
            {{ timestampToTime(scope.row.last_time) }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="上一次登录IP">
          <template slot-scope="scope">
            {{ scope.row.last_ip }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="360">
          <template slot-scope="scope">
            <el-button
              v-permission="'/admin/modify'"
              type="warning"
              @click="getUpdateForm(scope.row)"
            >修改</el-button>
            <el-button
              v-if="scope.row.status == 0"
              v-permission="'/admin/enable'"
              type="success"
              @click="enable(scope.row.guid)"
            >启用</el-button>
            <el-button
              v-if="scope.row.status == 1"
              v-permission="'/admin/disable'"
              type="info"
              @click="disable(scope.row.guid)"
            >禁用</el-button>
            <el-button
              v-permission="'/admin/distribution'"
              type="danger"
              @click="distributionRole(scope.row.guid, scope.row.role_guid)"
            >分配角色</el-button>
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
  </div>
</template>

<script>
import axios from 'axios'
import { mapGetters } from 'vuex'
import { timestampToTime } from '@/utils/time'
import { selectRole } from '@/api/user'
import { getList, disable, enable, addUser, updateUser } from '@/api/admin'
import { getRoleList } from '@/api/role'

export default {
  name: 'Dashboard',
  computed: {
    ...mapGetters(['name'])
  },
  data() {
    return {
      listLoading: true,
      // 用户列表
      userList: [],
      // 消息条数
      Tatol: 0,
      // 添加弹出框
      addFormVisible: false,
      addForm: {
        admin_name: '',
        password: '',
        nick_name: ''
      },
      // 修改弹出框
      updateFormVisible: false,
      updateForm: {
        guid: '',
        admin_name: '',
        nick_name: '',
        avatar_img: ''
      },

      // 上传验证
      ossUrl: 'http://jewelry3510.com/api/getsign',
      local: 'https://jewelry-1304044450.cos.ap-guangzhou.myqcloud.com/admin/',

      // 上传头像
      addImageUrl: '',
      imageUrl: '',
      imgLoading: false,
      imgIcon: 'el-icon-loading',
      imgText: '图片上传中',
      buttonType: false,

      // 分页
      tableDataLength: null,
      params: {
        page: 1,
        pagesize: 10
      },
      rolelist: [],
      roleDialog: false,
      roleForm: {
        admin_guid: '',
        role_guid: ''
      },

      rules: {
        admin_name: [
          { required: true, message: '用户名', trigger: 'blur' }
        ],
        nick_name: [
          { required: true, message: '昵称', trigger: 'blur' }
        ]
      }

    }
  },
  created() {
    this.fetchList()
  },
  mounted() {
    // this.getSign()
  },
  methods: {
    fetchList() {
      this.listLoading = true
      getList(this.params).then(response => {
        this.userList = response.list
        this.tableDataLength = response.count
        this.listLoading = false
      })
      getRoleList({}).then(response => {
        this.rolelist = response.list
      })
    },
    roleSelect() {
      selectRole(this.roleForm).then(response => {
        this.$message(response)
        this.roleDialog = false
      })
      this.fetchList()
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
    distributionRole(guid, role_guid) {
      this.roleDialog = true
      this.roleForm.admin_guid = guid
      this.roleForm.role_guid = role_guid
    },
    // 添加用户
    addUser() {
      this.addFormVisible = false
      addUser({
        admin_name: this.addForm.admin_name,
        password: this.addForm.password,
        nick_name: this.addForm.nick_name,
        avatar_img: this.addImageUrl
      }).then(response => {
        this.fetchList()
      })
    },
    // 修改用户信息
    updateUser() {
      this.updateFormVisible = false
      updateUser({
        guid: this.updateForm.guid,
        nick_name: this.updateForm.nick_name,
        avatar_img: this.updateForm.avatar_img
      }).then(response => {
        this.fetchList()
      })
    },

    // 初始化添加表单
    clearAddFrom() {
      this.addForm.admin_name = ''
      this.addForm.password = ''
      this.addForm.nick_name = ''
      this.addImageUrl = ''
      this.addFormVisible = true
    },
    // 获取修改表单信息
    getUpdateForm(obj) {
      this.updateForm.guid = obj.guid
      this.updateForm.admin_name = obj.admin_name
      this.updateForm.nick_name = obj.nick_name
      this.updateForm.avatar_img = obj.avatar_img
      this.updateFormVisible = true
    },
    // 图片加载失败处理
    errorHandler() {
      return true
    },
    // 图片上传失败处理
    handlerError(res) {
      this.imgText = '重新上传'
      this.$message({
        type: 'warning',
        message: '图片失败'
      })
    },
    // 10位时间戳转换
    timestampToTime(timestamp) {
      return timestampToTime(timestamp)
    },
    // 上传头像
    handleAvatar(res, file) {
      this.buttonType = false
      this.imgLoading = false
      var getSuffix = function(filename) {
        var pos = filename.lastIndexOf('.')
        var suffix = ''
        if (pos !== -1) {
          suffix = filename.substring(pos)
        }
        return suffix
      }

      var filename = new Date().getTime() + getSuffix(file.name)

      var formData = new FormData()
      formData.append('key', filename) // 存储在oss的文件路径
      formData.append('file', file)
      formData.append('success_action_status', 200) // 成功后返回的操作码

      const fileUrl = this.local + filename
      axios.post(this.ossUrl, formData).then(response => {
        if (this.addFormVisible) {
          this.addImageUrl = fileUrl
        } else {
          this.updateForm.avatar_img = fileUrl
        }
      })
    },
    // 提交头像
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isPNG = file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2
      this.imgText = '图片上传中'
      this.buttonType = true
      this.imgLoading = true

      if (!isJPG && !isPNG) {
        this.$message.error('上传头像图片只能是 JPG或PNG 格式!')
        return false
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
        return false
      }
      this.handleAvatar('res', file)
    }
  }
}
</script>

<style scoped>
.head_button {
  padding: 20px 20px 20px 20px;
}
.list {
  padding: 0px 20px 20px 20px;
}
.user {
  display: flex;
  flex-wrap: wrap;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
