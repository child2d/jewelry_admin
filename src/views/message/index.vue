<template>
  <div class="dashboard-container">
    <div style="margin-bottom:10px">
      <el-row style="margin-bottom: 10px">
        <el-col :span="20">
          <span class="header_font">订单号</span>
          <el-input
            v-model="params.where.order_num"
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
            <el-option label="未读" value="1" />
            <el-option label="已读" value="2" />
            <el-option label="清空" value="3" />
            <el-option label="删除" value="4" />
          </el-select>
          <el-date-picker
            v-model="dateSelect"
            style="margin-left:10px"
            size="small"
            type="daterange"
            range-separator="至"
            start-placeholder="留言开始时间"
            end-placeholder="留言结束时间"
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
        <el-table-column align="center" label="序号" width="50">
          <template slot-scope="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="订单号" width="250">
          <template slot-scope="scope">
            <router-link
              class="routerlink"
              tag="a"
              target="_blank"
              :to="{path:'/order/details',
                    query: {guid: scope.row.car_guid, order_num: scope.row.order_num}
              }"
            >{{ scope.row.order_num }}</router-link>
          </template>
        </el-table-column>
        <el-table-column align="center" label="留言内容">
          <template slot-scope="scope">
            {{ scope.row.content }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="状态" width="90">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status == 1" type="success">未读</el-tag>
            <el-tag v-if="scope.row.status == 2" type="danger">已读</el-tag>
            <el-tag v-if="scope.row.status == 3" type="danger">清空</el-tag>
            <el-tag v-if="scope.row.status == 4" type="danger">删除</el-tag>
          </template>
        </el-table-column>

        <el-table-column align="center" label="留言时间" width="180">
          <template slot-scope="scope">
            {{ scope.row.add_time | toTime }}
          </template>
        </el-table-column>

        <el-table-column align="center" label="操作" width="360">
          <template slot-scope="scope">
            <el-button
              v-permission="'/message/info'"
              type="warning"
              @click="view(scope.row)"
            >详情</el-button>
            <el-button
              :disabled="scope.row.status === 1 ? false : true"
              v-permission="'/message/reply'"
              type="success"
              @click="editeInfo(scope.row)"
            >回复</el-button>
            <el-button
              v-permission="'/message/delete'"
              :disabled="scope.row.status === 3 ? false : true"
              type="info"
              @click="disable(scope.row.id)"
            >删除</el-button>
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
        <el-form-item label="用户留言">
          <el-scrollbar
            style="background: rgb(243, 243, 243);;"
          >
            <div class="viewdiv">
              {{ ruleForm.content }}
            </div>
          </el-scrollbar>
        </el-form-item>

        <el-form-item label="回复内容">
          <el-scrollbar
            v-if="viewOption"
            style="background: rgb(243, 243, 243);;"
          >
            <div class="viewdiv">
              {{ ruleForm.replyContent }}
            </div>
          </el-scrollbar>

          <el-input
            v-else
            v-model="ruleForm.replyContent"
            :style="{ width: '100%'}"
            type="textarea"
            @input="change($event)"
          />
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="updateFormVisible = false">取 消</el-button>
        <el-button
          v-if="title == '查看留言' ? false : true "
          :disabled="replyBtn"
          type="primary"
          @click="submitForm('ruleForm')"
        >{{ replyBtnTitle }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getList, details, updataMessage, modify } from '@/api/message'
import { timestampToTime } from '@/utils/time'

export default {
  filters: {
    toTime: function(val) {
      if (val === '' || val === null) {
        return '————'
      }
      return timestampToTime(val)
    },
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
      // 列表参数
      params: {
        page: 1,
        pagesize: 10,
        where: {
          order_num: '',
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
      // 查看详情
      viewdata: {
        order_num: '',
        id: ''
      },
      // 修改状态
      modify: {
        id: '',
        status: ''
      },
      // 弹窗 显示标题
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
      updateFormVisible: false,
      replyBtn: false,
      replyBtnTitle: '回复',
      // 是否查看详情 操作
      viewOption: true
    }
  },
  created() {
    this.ruleFormBat = JSON.parse(JSON.stringify(this.ruleForm))
    this.fetchList()
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

    // 更改信息
    updataMessageInfo() {
      updataMessage(this.updata).then(response => {
        this.$message({
          type: 'info',
          message: response
        })
        this.fetchList()
      })
    },

    // 更改 状态
    deleteMessage() {
      modify(this.modify).then(response => {
        this.$message({
          type: 'info',
          message: response
        })
        this.fetchList()
      })
    },

    // 获取某条留言 详情
    getDetails() {
      details(this.viewdata).then(response => {
        if (response != null && response.replyContent !== '') {
          this.ruleForm.replyContent = response.content
          this.updateFormVisible = true
          this.replyBtn = true
          this.replyBtnTitle = '已回复'
          this.viewOption = true

          return
        }
        this.replyBtn = false
        this.replyBtnTitle = '回复'
        this.updateFormVisible = true
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

    //  查看详情
    view(row) {
      this.title = '查看留言'
      this.viewOption = true
      this.ruleForm = JSON.parse(JSON.stringify(row))
      this.viewdata.id = row.id
      this.getDetails()
    },

    // 点击回复按钮
    editeInfo(row) {
      this.title = '回复留言'
      this.viewOption = false
      this.ruleForm = JSON.parse(JSON.stringify(row))
      this.oneInfo = JSON.parse(JSON.stringify(row))
      this.viewdata.id = row.id
      this.getDetails()
    },

    // 删除
    disable(id) {
      this.modify.id = id
      this.modify.status = 4
      this.deleteMessage()
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
      const obj = {
        'id': this.ruleForm.id,
        'order_num': this.ruleForm.order_num,
        'user_guid': this.ruleForm.user_guid
      }
      for (const key in this.ruleForm) {
        if (this.ruleForm[key] !== this.oneInfo[key]) {
          obj[key] = this.ruleForm[key]
        }
      }
      this.updata = JSON.parse(JSON.stringify(obj))
      // 必传字段 长度为3 没有修改信息
      if (Object.keys(this.updata).length === 3) {
        this.$message({
          type: 'info',
          message: '无修改的信息'
        })
        return
      }
      this.updataMessageInfo()
    },
    // 此方法用来修复 不能正常输入的bug
    change(e) {
      this.$forceUpdate()
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
.routerlink {
  color: #66ccff;
}
.viewdiv {
  padding: 15px ;
  min-height: 100px;
  max-height: 150px;
  line-height: 25px;
  border-radius: 5px;
}

</style>
