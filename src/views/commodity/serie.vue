<template>
  <div class="dashboard-container">
    <div class="top_bar">
      <div style="width: 1000px">
        <el-row style="margin-bottom: 10px">
          <el-col :span="20">
            <span class="header_font">系列名称</span>
            <el-input
              v-model="params.where.name"
              style="width:180px;"
              size="small"
              placeholder="请选择"
              clearable
            />

          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-date-picker
              v-model="dateSelect"
              size="small"
              type="daterange"
              range-separator="至"
              start-placeholder="发布开始时间"
              end-placeholder="发布结束时间"
              @change="changeDate"
            />
            <el-button
              style="margin-left:5px;width:100px"
              type="primary"
              size="small"
              @click="fetchList"
            >搜索</el-button>
          </el-col>
        </el-row>
      </div>
      <div class="head_button">
        <!-- v-permission="'/admin/add'" -->
        <el-button
          type="primary"
          @click="addSerie"
        >添加系列</el-button>
      </div>

    </div>

    <!-- 列表 -->
    <div class="list">
      <el-table
        v-loading="listLoading"
        :data="carList"
        element-loading-text="Loading"
        border
        :header-cell-style="{background:'#eef1f6',color:'#606266'}"
        :row-style="{height:'20px'}"
        :cell-style="{padding:'5px'}"
      >
        <el-table-column align="center" label="序号" width="60">
          <template slot-scope="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>

        <el-table-column align="center" label="系列名称" prop="name" width="250px" />

        <el-table-column align="center" label="描述" width="300" prop="desc">
          <template slot-scope="scope">
            <el-popover trigger="hover" placement="top">
              <p style="width:500px">{{ scope.row.desc }}</p>
              <div slot="reference" class="name-wrapper">
                <p class="info-content">{{ scope.row.desc }}</p>
              </div>
            </el-popover>
          </template>
        </el-table-column>

        <el-table-column align="center" label="添加时间" width="300" prop="add_time">
          <template slot-scope="scope">
            {{ scope.row.add_time | toTime }}
          </template>
        </el-table-column>

        <el-table-column
          align="center"
          width="300"
          label="修改时间"
        >
          <template slot-scope="scope">
            {{ scope.row.update_time | toTime }}
          </template>
        </el-table-column>

        <el-table-column
          fixed="right"
          align="center"
          label="操作"
          width="360"
        >
          <template slot-scope="scope">
            <el-button
              v-permission="'/car/info'"
              size="small"
              type="warning"
              @click="detailsInfo(scope.row.guid)"
            >查看系列商品</el-button>

            <el-button
              v-permission="'/car/modify'"
              :disabled="(scope.row.status == 5 || scope.row.status == 6) ? true: false "
              size="small"
              @click="editeInfo(scope.row)"
            >编辑内容</el-button>
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

    <div>
      <!-- 修改内容 弹窗 -->
      <el-dialog
        :title="title"
        :visible.sync="showContentDialog"
        width="50%"
      >
        <el-form ref="ruleForm" :inline="true" :model="ruleForm" :rules="rules" label-width="80px" class="demo-ruleForm">

          <el-form-item label="系列名称" prop="name">
            <el-input v-model="ruleForm.name" class="dialog_input" />
          </el-form-item>
          <el-form-item label="描述" prop="desc">
            <el-input v-model="ruleForm.desc" class="dialog_input" />
          </el-form-item>
        </el-form>
        <br>
        <span slot="footer" class="dialog-footer">
          <el-button @click="showContentDialog = false">取 消</el-button>
          <el-button type="primary" @click="submitForm('ruleForm')">{{ buttonContent }}</el-button>
        </span>
      </el-dialog>

      <!-- 图片预览弹窗 -->
      <el-dialog
        title="预览"
        :visible.sync="imgDialogVisible"
      >
        <img width="100%" :src="dialogImageUrl" alt="">
      </el-dialog>
      <!-- 律师函文件上传 -->
      <el-dialog
        title="律师函文件上传"
        :visible.sync="fileDialogVisible"
        width="30%"
      >
        <input id="file" type="file" name="file">
        <br><br>
        <el-button type="primary" @click="upload()">确 定</el-button>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { getList, updata, serieAdd } from '@/api/serie'
import { timestampToTime } from '@/utils/time'
import axios from 'axios'

import '@/assets/icons/iconfont.css'

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
    },
    isNull: function(val) {
      if (val === '' || val === null) {
        return 'null'
      }
      return val
    }
  },
  data() {
    return {
      listLoading: true,
      // 图片预览弹窗
      imgDialogVisible: false,
      dialogImageUrl: '',
      // 修改内容弹窗
      showContentDialog: false,
      // 文件上传弹窗
      fileDialogVisible: false,
      // 当前时间戳
      nowtime: Date.parse(new Date()),
      // 用户列表
      carList: [],
      // 分页
      tableDataLength: null,
      // 初始请求参数
      params: {
        page: 1,
        pagesize: 10,
        where: {
          name: '',
          status: '',
          add_time: []
        }
      },
      // 日期选择
      dateSelect: '',
      // 附件列表
      fileList: [],

      // 上传文件 设置
      ossUrl: '',

      // 表单信息
      ruleForm: {
        guid: ''
      },
      oneInfo: {},
      // 表单备份
      ruleFormBat: '',
      updata: {
        guid: ''
      },

      title: '修改内容',
      buttonContent: '',

      // 表单验证规则
      rules: {
        name: [
          { required: true, message: '系列名称', trigger: 'blur' }
        ],
        desc: [
          { required: true, message: '描述', trigger: 'blur' }
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
      getList(this.params).then(response => {
        this.carList = response.list
        this.tableDataLength = response.count
        this.listLoading = false
      })
    },
    updataSerie() {
      updata(this.updata).then(response => {
        this.$message({
          type: 'info',
          message: response
        })
        this.fetchList()
      })
    },
    addSerie() {
      this.title = '新增系列'
      this.buttonContent = '确定'
      this.ruleForm = JSON.parse(JSON.stringify(this.ruleFormBat))
      this.showContentDialog = true
    },
    serieAdd() {
      serieAdd(this.updata).then(response => {
        this.$message({
          type: 'info',
          message: response
        })
        this.fetchList()
      })
    },
    upload() {
      var getSuffix = function(fileName) {
        var pos = fileName.lastIndexOf('.')
        var suffix = ''
        if (pos !== -1) {
          suffix = fileName.substring(pos)
        }
        if (suffix !== '.pdf') {
          return false
        }
        return suffix
      }

      var file = document.getElementById('file').value
      if (file.length === 0) {
        alert('请选择文件')
        return
      }
      if (getSuffix(file) === false) {
        alert('请选择pdf文件')
        return
      }

      var filename = new Date().getTime() + getSuffix(file)
      var formData = new FormData()
      // 如果是base64文件，那么直接把base64字符串转成blob对象进行上传就可以了
      formData.append('file', document.getElementById('file').files[0])
      console.log('document.getElementById ', document.getElementById('file').files[0])

      formData.append('success_action_status', 200) // 成功后返回的操作码

      var fileUrl = this.ossUrl + '/' + this.dir + filename
      axios.post(this.ossUrl, formData).then((response) => {
        this.updata.push_file = fileUrl
        this.updataSerie()
        this.fileDialogVisible = false
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

    // 预览图片
    pictureCardPreview(url) {
      this.dialogImageUrl = url
      this.imgDialogVisible = true
    },

    //  跳转
    detailsInfo(guid) {
      const questionInfo = this.$router.resolve({
        path: '/commodity/item',
        query: {
          serie_guid: guid
        }
      })
      window.open(questionInfo.href, '_blank')
    },
    editeInfo(row) {
      this.title = '编辑信息'
      this.buttonContent = '修改'
      this.showContentDialog = true
      this.ruleForm = JSON.parse(JSON.stringify(row))
      // oneInfo 用于比对修改过的信息
      this.oneInfo = JSON.parse(JSON.stringify(row))
    },
    // 表单验证
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.showContentDialog = false
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
      if (this.title === '新增系列') {
        this.serieAdd()
      } else {
        this.updataSerie()
      }
    },

    // 数据 筛选
    changeDate() {
      if (this.dateSelect === null) {
        this.params.where.add_time = []
        return
      }
      const start = Date.parse(this.dateSelect[0])
      const end = Date.parse(this.dateSelect[1])
      const date = [start / 1000, end / 1000]
      this.params.where.add_time = date
    }

  }
}
</script>

<style scoped>
.top_bar {
  margin-bottom:10px;
  width: 100%;
  display: flex;
  justify-content: space-between;
}
.dashboard-container {
  margin: 10px 20px 0;

}
.head_button {
  /* padding: 20px 20px 20px 20px; */
  widows: 200px;
  margin-top: 20px;
}
.header_font {
  font-size: 14px;
  text-align: left;
  color: #747774;
  margin-left:10px;
  margin-right:10px;
}
.iconpic {
  font-size: 100px;
  line-height: 120px;
  cursor: pointer;
  color: #b1b1b1;
}
.table_span_color {
  color: #aaa;
}
.info-content {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}
.list {
  margin-bottom: 10px;
}

.file {
  width: 100px;
  margin-right: 20px;
  margin-top: 20px;
  cursor: pointer;
}
.dialog_input {
  width: 300px;
}
.thepages {
  margin-bottom: 10px;
}
.el_tag_margin {
  margin-bottom: 5px;
  margin-top: 5px;
  margin-left: 2px;
  margin-right: 2px;
}
</style>

