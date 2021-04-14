<template>
  <div class="dashboard-container">
    <div style="margin-bottom:10px">
      <el-row style="margin-bottom: 10px">
        <el-col :span="20">
          <span class="header_font">用户名</span>
          <el-input
            v-model="params.where.nick_name"
            style="width:180px;"
            size="small"
            placeholder="请输入"
            clearable
          />
          <span class="header_font">状态</span>
          <el-select
            v-model="params.where.status"
            style="width:180px;"
            size="small"
            placeholder="请选择"
            clearable
          >
            <el-option label="启用" value="1" />
            <el-option label="禁用" value="2" />
          </el-select>
          <el-date-picker
            v-model="dateSelect"
            style="margin-left:10px"
            size="small"
            type="daterange"
            range-separator="至"
            start-placeholder="注册开始时间"
            end-placeholder="注册结束时间"
            @change="changeDate"
          />
          <el-button
            style="margin-left:5px;width:100px"
            type="primary"
            size="small"
            @click="fetchList"
          >搜索</el-button>

        </el-col></el-row>
    </div>

    <div class="list">
      <el-table
        v-loading="listLoading"
        :data="userList"
        element-loading-text="Loading"
        :header-cell-style="{background:'#eef1f6',color:'#606266'}"
        border
      >
        <el-table-column align="center" label="序号" width="40">
          <template slot-scope="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="用户" width="60">
          <template slot-scope="scope">
            <div class="user">
              <el-avatar :size="40">
                <img :src="scope.row.avatar_img">
              </el-avatar>
              <div class="admin_name">{{ scope.row.nick_name }}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="电话">
          <template slot-scope="scope">
            {{ scope.row.phone | userphone }}
          </template>
        </el-table-column>

        <el-table-column align="center" label="状态">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status == 1" type="success">启用</el-tag>
            <el-tag v-if="scope.row.status == 2" type="danger">禁用</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" label="登录平台">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.play_from == 1" type="success">微信</el-tag>
            <el-tag v-if="scope.row.play_from == 2" type="danger">抖音</el-tag>
          </template>
        </el-table-column>

        <el-table-column align="center" label="注册时间">
          <template slot-scope="scope">
            {{ timestampToTime(scope.row.add_time) }}
          </template>
        </el-table-column>

        <el-table-column align="center" label="操作" width="360">
          <template slot-scope="scope">
            <el-button
              v-permission="'/user/car'"
              type="warning"
              @click="viewCar(scope.row.guid)"
            >查看购物车</el-button>
            <el-button
              v-permission="'/user/modify'"
              type="warning"
              @click="editeInfo(scope.row)"
            >修改</el-button>
            <el-button
              v-if="scope.row.status == 2"
              v-permission="'/user/enable'"
              type="success"
              @click="enable(scope.row.guid)"
            >启用</el-button>
            <el-button
              v-if="scope.row.status == 1"
              v-permission="'/user/disable'"
              type="info"
              @click="disable(scope.row.guid)"
            >禁用</el-button>
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

    <el-dialog
      :title="title"
      :visible.sync="updateFormVisible"
      width="700px"
    >
      <el-form
        ref="ruleForm"
        :model="ruleForm"
        label-width="100px"
      >
        <el-form-item label="昵称">
          <el-input
            v-model="ruleForm.nick_name"
            class="dialog_input"
            autocomplete="off"
          />
        </el-form-item>
        <el-form-item label="电话">
          <el-input
            v-model="ruleForm.phone"
            class="dialog_input"
            autocomplete="off"
          />
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="updateFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')">修改</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getList, disable, enable, updataUser } from '@/api/theuser'
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
      listLoading: true,
      // 用户列表
      userList: [],
      // 分页
      tableDataLength: null,
      params: {
        page: 1,
        pagesize: 10,
        where: {
          nick_name: '',
          status: '',
          add_time: ''
        }
      },
      value_1: '',
      option_1: '',
      // 日期选择
      dateSelect: '',
      // 更新的数据
      updata: {
        order_num: ''
      },
      title: '',
      // 编辑 表单
      ruleForm: {},
      // 再次确认密码
      password_2: '',
      // 默认不编辑 用户密码
      showPasswordFlag: false,
      // 用于与 ruleForm 比对
      oneInfo: {},
      // 表单备份
      ruleFormBat: '',
      updateFormVisible: false
    }
  },
  created() {
    this.ruleFormBat = JSON.parse(JSON.stringify(this.ruleForm))
    this.fetchList()
  },
  mounted() {
  },
  methods: {
    fetchList() {
      this.listLoading = true
      getList(this.params).then(response => {
        this.userList = response.list
        this.tableDataLength = response.count
        this.listLoading = false
      })
    },

    // 更改用户信息
    updataUserInfo() {
      updataUser(this.updata).then(response => {
        this.$message({
          type: 'info',
          message: response
        })
        this.fetchList()
      })
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
    viewCar(guid) {
      const carInfo = this.$router.resolve({
        path: '/car/details',
        query: {
          guid: guid
        }
      })
      window.open(carInfo.href, '_blank')
    },
    // 点击编辑按钮
    editeInfo(row) {
      this.updateFormVisible = true
      this.title = '编辑用户'
      this.ruleForm = JSON.parse(JSON.stringify(row))
      // oneInfo 用于比对修改过的信息
      this.oneInfo = JSON.parse(JSON.stringify(row))
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

    // 日期筛选
    changeDate() {
      if (this.dateSelect === null) {
        this.params.where.add_time = []
        return
      }
      const start = Date.parse(this.dateSelect[0])
      const end = Date.parse(this.dateSelect[1])
      const date = [start / 1000, end / 1000]
      this.params.where.add_time = date
    },
    // 表单验证
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.updateFormVisible = false
          this.findDiffData()
        } else {
          return false
        }
      })
    },
    // 寻找修改过的字段
    findDiffData() {
      // 必传字段
      const obj = { 'guid': this.ruleForm.guid }
      for (const key in this.ruleForm) {
        if (this.ruleForm[key] !== this.oneInfo[key]) {
          obj[key] = this.ruleForm[key]
        }
      }
      this.updata = JSON.parse(JSON.stringify(obj))
      // 必传字段 长度为1 没有修改信息
      if (Object.keys(this.updata).length === 1) {
        this.$message({
          type: 'info',
          message: '无修改的信息'
        })
        return
      }
      this.updataUserInfo()
    }

  }
}
</script>

<style  scoped>
.dashboard-container {
  margin: 10px 20px 0;
}
.header_font {
  font-size: 14px;
  text-align: left;
  color: #747774;
  margin-left:10px;
  margin-right:10px;
}
.dialog_input {
  width: 500px;
}
.thepages {
  margin-top: 10px;
  margin-bottom: 10px;
}
</style>
